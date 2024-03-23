const stripe = require("../config/stripeConfig");

const getStripeAccBalance = async (req, res, next) => {
  const balance = await stripe.balance.retrieve();
  res.status(200).json({
    balance,
  });
};

module.exports = {
  getStripeAccBalance,
};
