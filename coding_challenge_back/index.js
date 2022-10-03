require("dotenv").config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const path = require("path");
global.appRoot = path.resolve(__dirname);

app.use(bodyParser.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);

require("./routes/api")(app);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
