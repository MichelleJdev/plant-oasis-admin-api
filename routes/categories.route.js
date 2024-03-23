const router = require("express").Router();
const catchAsync = require("../utils/catchAsync");

// Controllers
const {
  getCategories,
  getCategoryById,
  createCategory,
  patchUpdateCategory,
  deleteCategory,
  renameCategory,
} = require("../controllers/categories.controller");

// Middleware
const {
  dataValidator,
  categorySchema,
  categoryPatchSchema,
} = require("../middleware/validations.middleware");

router.get("/", catchAsync(getCategories));
router.get("/:id", catchAsync(getCategoryById));
router.post(
  "/",
  catchAsync(dataValidator(categorySchema)),
  catchAsync(createCategory)
);
router.patch(
  "/rename/:id",
  catchAsync(dataValidator(categoryPatchSchema)),
  catchAsync(renameCategory)
);

router.patch(
  "/:id",
  catchAsync(dataValidator(categoryPatchSchema)),
  catchAsync(patchUpdateCategory)
);
router.delete("/:id", catchAsync(deleteCategory));

module.exports = router;
