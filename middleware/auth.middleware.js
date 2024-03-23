const AppError = require("../utils/AppError");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

const ensureAuth = async (req, res, next) => {
  const authHeader = req.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    AppError.unauthenticated();
  }
  const accessToken = authHeader.split(" ")[1];

  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET,
    (error, decodedToken) => {
      if (error) {
        if (error.name === "TokenExpiredError")
          return next(new AppError(403, "access expired"));
        next(error);
      } else {
        req.admin = decodedToken.admin;
        next();
      }
    }
  );
};

const ensureNewUser = async (req, res, next) => {
  const { user } = req.body;
  const existingUser = await User.findOne({
    email: user.email?.toLowerCase(),
  });

  if (!existingUser) return next();
  throw new AppError(400, "Email address already registered");
};

module.exports = {
  ensureAuth,
  ensureNewUser,
};
