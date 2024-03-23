const router = require("express").Router();
const catchAsync = require("../utils/catchAsync");

// Controllers

const { getStripeAccBalance } = require("../controllers/stripe.controller");

router.get("/balance", catchAsync(getStripeAccBalance));

module.exports = router;
