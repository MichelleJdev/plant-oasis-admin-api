const STRIPE_SECRET_API_KEY = process.env.STRIPE_SECRET_API_KEY;
const stripe = require("stripe")(STRIPE_SECRET_API_KEY);

module.exports = stripe;
