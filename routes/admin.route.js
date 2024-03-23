const router = require("express").Router();

// Controllers
const { createAdmin } = require("../controllers/admin.controller");

// Middleware

// Validation
const {
  dataValidator,
  adminSchema,
} = require("../middleware/validations.middleware");

const {
  ensureAuth,
  ensurePrimaryAdmin,
} = require("../middleware/auth.middleware");

// Utils
const catchAsync = require("../utils/catchAsync");

router.post(
  "/",
  catchAsync(dataValidator(adminSchema)),
  catchAsync(createAdmin)
);

router.delete("/:id");

module.exports = router;
