const Order = require("../models/Order.model");
const AppError = require("../utils/AppError");

const getOrderById = async (req, res) => {
  const { id } = req.params;
  const foundOrder = await Order.findById(id);
  if (!foundOrder) throw new AppError(404, "Order not found");
  res.status(200).json({ order: foundOrder });
};

const getOrders = async (req, res, next) => {
  const orders = await Order.find({}).sort({ createdAt: -1 });
  res.json(orders);
};

const patchUpdateOrder = async (req, res) => {
  const { id } = req.params;
  const { order } = req.body;
  if (!id) throw new AppError(401, "Invalid request");
  const foundOrder = await Order.findById(id);
  if (!foundOrder) throw new AppError(404, "Order not found");

  for (let key in order) {
    foundOrder[key] = order[key];
  }
  const updatedOrder = await foundOrder.save();
  res.status(200).json(updatedOrder);
};

const changeOrderStatus = async (req, res, next) => {
  const { id } = req.params;
  const foundOrder = await Order.findById(id);
  if (!foundOrder) throw new AppError(404, "Order not found");
  const { order } = req.body;
  foundOrder.status = order.status;
  await foundOrder.save();
  res.sendStatus(200);
};

const getOrdersOfLast24hrs = async (req, res, next) => {
  const date = new Date();
  const recentOrders = await Order.countDocuments({
    createdAt: { $gte: date.setHours(date.getHours() - 24), $lte: Date.now() },
  });
  res.status(200).json(recentOrders);
};

module.exports = {
  getOrders,
  getOrderById,
  changeOrderStatus,
  patchUpdateOrder,
  getOrdersOfLast24hrs,
};
