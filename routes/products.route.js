const router = require("express").Router();
const catchAsync = require("../utils/catchAsync");

// Controllers
const {
  getProductById,
  getProducts,
  getCartData,
  createProduct,
  patchUpdateProduct,
  deleteProduct,
  getProductCount,
} = require("../controllers/products.controller");

// Middleware
const {
  dataValidator,
  productSchema,
  productPatchSchema,
} = require("../middleware/validations.middleware");

const { ensureAuth } = require("../middleware/auth.middleware");

router.use(catchAsync(ensureAuth));

router.get("/", catchAsync(getProducts));

router.get("/count", catchAsync(getProductCount));

router.get("/:id", catchAsync(getProductById));

router.post(
  "/",
  catchAsync(dataValidator(productSchema)),
  catchAsync(createProduct)
);
router.post("/basket", catchAsync(getCartData));

router.patch(
  "/:id",
  catchAsync(dataValidator(productPatchSchema)),
  catchAsync(patchUpdateProduct)
);

router.delete("/:id", catchAsync(deleteProduct));

module.exports = router;
