const Admin = require("../models/Admin.model");
const AppError = require("../utils/AppError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRATION = "60s";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  maxAge: 24 * 60 * 60 * 1000,
};

const handleLogin = async (req, res) => {
  const { email, password } = req.body.auth;
  const foundAdmin = await Admin.findOne({ email });
  if (!foundAdmin) throw new AppError(401, "invalid email address or password");
  const validPassMatch = await bcrypt.compare(password, foundAdmin.password);
  if (!validPassMatch) {
    throw new AppError(401, "invalid email address or password");
  }

  const accessToken = jwt.sign(
    {
      admin: {
        id: foundAdmin._id,
        isPrimary: foundAdmin.isPrimary,
      },
    },
    ACCESS_TOKEN_SECRET,
    {
      expiresIn: ACCESS_TOKEN_EXPIRATION,
    }
  );

  const refreshToken = jwt.sign(
    {
      userId: foundAdmin._id,
    },
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: "24h",
    }
  );
  foundAdmin.refreshToken = refreshToken;
  await foundAdmin.save();
  console.log(foundAdmin);
  res.cookie("jwt", refreshToken, REFRESH_COOKIE_OPTIONS);
  res.status(200).json({
    accessToken,
    admin: {
      id: foundAdmin._id,
      isPrimary: foundAdmin.isPrimary,
      firstName: foundAdmin.firstName,
    },
  });
};

const handleRefresh = async (req, res, next) => {
  const { cookies } = req;
  if (!cookies?.jwt) throw new AppError(401, "no cookie");
  refreshToken = cookies.jwt;
  const foundAdmin = await Admin.findOne({ refreshToken });
  if (!foundAdmin) throw new AppError(401, "access denied");
  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decodedToken) => {
    if (err) return next(new AppError(403, "refresh failed"));
    const accessToken = jwt.sign(
      {
        admin: {
          id: foundAdmin._id,
          isPrimary: foundAdmin.isPrimary,
        },
      },
      ACCESS_TOKEN_SECRET,
      {
        expiresIn: ACCESS_TOKEN_EXPIRATION,
      }
    );

    const adminData = {
      id: foundAdmin._id,
      isPrimary: foundAdmin.isPrimary,
      firstName: foundAdmin.firstName,
    };

    res.status(201).json({
      accessToken,
      admin: adminData,
    });
  });
};

const handleLogout = async (req, res, next) => {
  const { cookies } = req;
  if (!cookies?.jwt) return res.sendStatus(204);
  const refreshToken = cookies.jwt;
  const foundAdmin = await Admin.findOne({ refreshToken });
  if (foundAdmin) {
    foundAdmin.refreshToken = "";
    await foundAdmin.save();
  }
  res.clearCookie("jwt", REFRESH_COOKIE_OPTIONS);
  return res.sendStatus(204);
};
module.exports = {
  handleLogin,
  handleRefresh,
  handleLogout,
};
