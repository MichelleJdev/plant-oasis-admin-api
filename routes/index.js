const express = require("express");
const router = express.Router();

const authRouter = require("./auth.route");
const adminRouter = require("./admin.route");
const usersRouter = require("./users.route");
const productsRouter = require("./products.route");
const categoriesRouter = require("./categories.route");
const ordersRouter = require("./orders.route");
const stripeRouter = require("./stripe.route");

router.use("/auth", authRouter);
router.use("/admin", adminRouter);
router.use("/users", usersRouter);
router.use("/products", productsRouter);
router.use("/categories", categoriesRouter);
router.use("/orders", ordersRouter);
router.use("/stripe", stripeRouter);

module.exports = router;
