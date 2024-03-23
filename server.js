const express = require("express");
const app = express();
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({
    path: require("path").join(__dirname, "/config/.env"),
  });
  app.use(require("morgan")("dev"));
}

const connectDb = require("./config/db");
connectDb();
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./routes");

const CLIENT_URL = process.env.CLIENT_URL;

const {
  logErrors,
  handleAppError,
  handleJoiError,
  handleMongooseError,
  handleServerError,
} = require("./middleware/errorHandlers.middleware");

app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(express.urlencoded());
app.use(express.json());

app.use("/", routes);
app.use(logErrors);
app.use(handleAppError);
app.use(handleJoiError);
app.use(handleMongooseError);
app.use(handleServerError);

const PORT = process.env.PORT;
mongoose.connection.once("open", () => {
  console.log("DB connection open");
  app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
});
