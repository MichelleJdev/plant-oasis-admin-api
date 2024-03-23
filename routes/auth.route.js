const router = require("express").Router();

// Controllers
const {
  handleLogin,
  handleRefresh,
  handleLogout,
} = require("../controllers/auth.controller");

// Middleware
const {
  dataValidator,
  loginSchema,
} = require("../middleware/validations.middleware");

// Utils
const catchAsync = require("../utils/catchAsync");

router.post(
  "/login",
  catchAsync(dataValidator(loginSchema)),
  catchAsync(handleLogin)
);

router.get("/refresh", catchAsync(handleRefresh));

router.get("/logout", catchAsync(handleLogout));

module.exports = router;
