const AppError = require("../utils/AppError");

const logErrors = (err, req, res, next) => {
  console.error(err);
  next(err);
};

const handleAppError = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.status).json({ message: err.message });
  }
  next(err);
};

const handleJoiError = (err, req, res, next) => {
  const isJoiError = err.isJoi;
  if (isJoiError) {
    console.log("Error handled by Joi error handler");
    const errorMessage = err.details.reduce((acc, curr, idx) => {
      if (idx === err.details.length - 1) return acc + curr.message;
      return acc + curr.message + " & ";
    }, "");
    return res.status(400).send(errorMessage);
  }
  next(err);
};
const handleMongooseError = (err, req, res, next) => {
  const isMongooseValidationError = err.name && err.name === "ValidationError";
  if (isMongooseValidationError) {
    console.log("Error handled by Mongoose error handler");

    return res.status(400).send(err.name);
  }
  next(err);
};

const handleServerError = (err, req, res, next) => {
  console.log("Error handled by server error handler");
  res.status(500).json({ message: "Something went pop" });
};

module.exports = {
  logErrors,
  handleAppError,
  handleJoiError,
  handleMongooseError,
  handleServerError,
};
