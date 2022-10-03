const fs = require("fs");
const path = require("path");
const axios = require("axios");
const URL = require("url").URL;
const CONSTANTS = require("../config/constants");

module.exports = {
  downloadImage: async function (url, image_path) {
    try {
      new URL(url);

      const response = await axios({
        method: "GET",
        url: url,
        responseType: "stream",
      });

      if (
        ["image/jpeg", "image/png", "image/svg+xml"].indexOf(
          response.data.headers["content-type"]
        ) < 0
      ) {
        throw "ERROR_NOT_IMAGE";
      }

      const pf = response.data.pipe(fs.createWriteStream(image_path));

    } catch (error) {
      throw error;
    }
  },

  generateFileName: function () {
    var length = 32;
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },

  imageValidation: async function (imageName) {
    const vision = require("@google-cloud/vision");

    const client = new vision.ImageAnnotatorClient();

    const [result] = await client.safeSearchDetection(
      path.join(appRoot, process.env.AVATARS_FOLDER, imageName)
    );

    const detections = result.safeSearchAnnotation;
    console.log(detections);
    if (detections)
      return {
        adult: CONSTANTS.GOOGLE_SAFE_SEARCH[detections.adult],
        medical: CONSTANTS.GOOGLE_SAFE_SEARCH[detections.medical],
        racy: CONSTANTS.GOOGLE_SAFE_SEARCH[detections.racy],
        spoof: CONSTANTS.GOOGLE_SAFE_SEARCH[detections.spoof],
        violence: CONSTANTS.GOOGLE_SAFE_SEARCH[detections.violence],
      };
    else return null;
  },

  mvAvatarFile: async function (fileName) {
    fs.rename(
      path.join(appRoot, process.env.TMP_UPLOAD_FOLDER, fileName),
      path.join(appRoot, process.env.AVATARS_FOLDER, fileName),
      (error) => {
        if (error) {
          console.error(error);
        }
      }
    );
  },

  notifyCallback: function (url, isAproved) {
    axios({
      method: "POST",
      url: url,
      data: {
        isAproved: isAproved,
      },
    }).catch((err) => {
      console.log(err);
    });
  },
};
