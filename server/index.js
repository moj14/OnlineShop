require("dotenv").config();
const express = require("express");
const sequelize = require("./db");
const models = require("./models/models");
const PORT = process.env.PORT || 5000;
const router = require("./routes/index");
const app = express();
const cors = require("cors");
const ErrorHandlingMiddleware = require("./middleware/ErrorHandlingMiddleware");
const fileUpload = require("express-fileupload");
const path = require("path");

app.use(cors());
app.use(express.json());
app.use(fileUpload({}));
app.use(express.static(path.resolve(__dirname, "static")));
app.use("/api", router);

app.use(ErrorHandlingMiddleware);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(5000, () => {
      console.log(`Server started at port ${PORT}`);
    });
  } catch (error) {}
};

start();
