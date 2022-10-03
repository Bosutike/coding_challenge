const multer = require("multer");
const { type } = require("os");
const path = require("path");
const { Images, Users, Reports } = require("../models");
const CONSTANTS = require("../config/constants");
const { Op } = require("sequelize");

const HELPER = require("../utils/helper");

// Default file upload folder
const upload = multer({
  dest: process.env.TMP_UPLOAD_FOLDER,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
      return callback(new Error("Only images are allowed"));
    }
    callback(null, true);
  },
});

module.exports = function (app) {
  app.get("/api/get-completed-reports", async (req, res) => {
    const attrs = await Reports.getAttributes();
    const rows = await Reports.findAll({
      order: [["evaluationAvg", "DESC"]],
      where: {
        [Op.or]: [
          { status: CONSTANTS.REPORT_STATUS.INVALID },
          { status: CONSTANTS.REPORT_STATUS.VALID },
        ],
      },
      raw: true,
    });
    const data = { columns: Object.keys(attrs), rows: rows };
    res.send(data);
  });

  app.get("/api/get-not-completed-reports", async (req, res) => {
    const attrs = await Reports.getAttributes();
    const rows = await Reports.findAll({
      where: {
        status: CONSTANTS.REPORT_STATUS.IN_PROGRESS,
      },
      raw: true,
    });
    const data = { columns: Object.keys(attrs), rows: rows };
    res.send(data);
  });

  app.post("/api/report-approval", async (req, res) => {
    if (
      !req.body.reportId ||
      isNaN(req.body.reportId) ||
      !typeof req.body.isApproved == "boolean"
    ) {
      return res.status(404).send("Error! Invalid fields!");
    }

    await Reports.update(
      {
        isValid: req.body.isApproved,
        status: CONSTANTS.REPORT_STATUS.ARCHIVED,
      },
      {
        where: {
          id: req.body.reportId,
          status: { [Op.ne]: CONSTANTS.REPORT_STATUS.ARCHIVED },
        },
      }
    )
      .then(() => {
        Reports.findByPk(req.body.reportId)
          .then((result) => {
            Images.findByPk(result.imageId)
              .then((image) => {
                HELPER.notifyCallback(image.callbackUrl, req.body.isApproved);
              })
              .catch((err) => {
                console.log(err);
                return res.status(404).send({ error: "Error updating db." });
              });
          })
          .catch((err) => {
            console.log(err);
            return res.status(404).send({ error: "Error updating db." });
          });
      })
      .catch((err) => {
        console.log(err);
        return res.status(404).send({ error: "Error updating db." });
      });

    res.send("Success!");
  });

  app.post("/api/submit-report", upload.single("file"), async (req, res) => {
    if (
      !req.body.user_id ||
      (!req.file && !req.body.file) ||
      !req.body.callbackUrl
    ) {
      return res.status(400).send("Error! Invalid fields!");
    }

    try {
      new URL(req.body.callbackUrl);
    } catch (err) {
      console.log(err);
      return res.status(400).send("Error! callbackUrl not valid!");
    }

    req.body.user_id = parseInt(req.body.user_id);

    if (isNaN(req.body.user_id)) {
      return res.status(400).send("Error! Id invalid!");
    }

    const user = await Users.findByPk(req.body.user_id);
    if (user === null) {
      return res.status(400).send("Error! Id does not exist!");
    }

    var fileName = "";

    if (req.file) {
      fileName = req.file.filename;
    } else if (req.body.file) {
      fileName = HELPER.generateFileName();
      try {
        await HELPER.downloadImage(
          req.body.file,
          appRoot + "/" + process.env.TMP_UPLOAD_FOLDER + fileName
        );
      } catch (err) {
        console.log(err);
        return res.status(400).send("Error! Image URL invalid!");
      }
    }

    try {
      const image = await Images.create({
        userId: req.body.user_id,
        fileName: fileName,
        callbackUrl: req.body.callbackUrl,
      });

      await HELPER.mvAvatarFile(fileName);

      // Call image validation and generate report
      createImageReport(image.id, fileName, req.body.callbackUrl);

      return res.send("Image Uploaded");
    } catch (err) {
      console.log(err);
      return res.status(400).send(err);
    }
  });
};

// Validates image and saves report in DB
async function createImageReport(imageId, imageName, callbackUrl) {
  const report = await Reports.create({
    imageId: imageId,
    isValid: false,
    status: CONSTANTS.REPORT_STATUS.IN_PROGRESS,
  });

  const evaluation = await HELPER.imageValidation(imageName);

  var isValid = false;

  if (evaluation) {
    if (
      evaluation.adult <= 3 &&
      evaluation.medical <= 3 &&
      evaluation.racy <= 3 &&
      evaluation.spoof <= 3 &&
      evaluation.violence <= 3
    ) {
      isValid = true;
    }

    const evaluationAvg =
      (evaluation.adult +
        evaluation.medical +
        evaluation.racy +
        evaluation.spoof +
        evaluation.violence) /
      5;

    report.update({
      isValid: isValid,
      status: CONSTANTS.REPORT_STATUS.VALID,
      adultEvaluation: evaluation.adult,
      medicalEvaluation: evaluation.medical,
      racyEvaluation: evaluation.racy,
      spoofEvaluation: evaluation.spoof,
      violenceEvaluation: evaluation.violence,
      evaluationAvg: evaluationAvg,
    });

    HELPER.notifyCallback(callbackUrl, isValid);
  } else {
    report.update({
      isValid: false,
      status: CONSTANTS.REPORT_STATUS.ERROR,
    });

    HELPER.notifyCallback(callbackUrl, isValid);
  }
}
