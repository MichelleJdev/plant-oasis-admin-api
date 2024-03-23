const router = require("express").Router();
const catchAsync = require("../utils/catchAsync");

// Controllers
const {
  getOrderById,
  getOrders,
  changeOrderStatus,
  patchUpdateOrder,
  getOrdersOfLast24hrs,
} = require("../controllers/orders.controller");

// Middleware
const {
  dataValidator,
  orderSchema,
  orderStatusSchema,
  orderPatchSchema,
} = require("../middleware/validations.middleware");

// Routes
router.route("/").get(catchAsync(getOrders));

router.route("/recent").get(catchAsync(getOrdersOfLast24hrs));

router.patch(
  "/status/:id",
  catchAsync(dataValidator(orderStatusSchema)),
  catchAsync(changeOrderStatus)
);

router
  .route("/:id")
  .get(catchAsync(getOrderById))
  .patch(
    catchAsync(dataValidator(orderPatchSchema)),
    catchAsync(patchUpdateOrder)
  );

module.exports = router;
