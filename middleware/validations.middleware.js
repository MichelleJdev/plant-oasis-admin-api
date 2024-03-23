const Joi = require("joi");
const { ObjectId } = require("mongodb");

const isValidObjId = (value, helpers) => {
  if (!ObjectId.isValid(value)) return helpers.error("any.invalid");
  return value;
};

// ORDER schema
const orderSchema = Joi.object({
  order: Joi.object({
    customer: Joi.string()
      .custom(isValidObjId, "Mongodb objectId validation")
      .required(),

    items: Joi.array()
      .items(
        Joi.object({
          product: Joi.string()
            .custom(isValidObjId, "Mongodb objectId validation")
            .required(),
          quantity: Joi.number().min(1).required(),
          price: Joi.number().min(1).required(),
        })
      )
      .required(),
    status: Joi.string()
      .valid("pending", "processing", "shipped", "delivered", "cancelled")
      .required(),
    shippingAddress: Joi.string().required(),
  }).required(),
}).required();

// Order status schema

const orderStatusSchema = Joi.object({
  order: Joi.object({
    status: Joi.string()
      .valid("pending", "shipped", "delivered", "cancelled")
      .required(),
  }).required(),
}).required();

// USER schema

const userSchema = Joi.object({
  user: Joi.object({
    name: Joi.string().min(1).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
      .required(),
  }).required(),
}).required();

const userPatchSchema = Joi.object({
  user: Joi.object({
    name: Joi.string().min(1),
    email: Joi.string().email(),
  })
    .min(1)
    .required(),
}).required();

const userPasswordSchema = Joi.object({
  user: Joi.object({
    password: Joi.string()
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
      .required(),
  }).required(),
}).required();

// ADMIN schema
const adminSchema = Joi.object({
  admin: Joi.object({
    firstName: Joi.string().min(1).max(30).required(),
    lastName: Joi.string().min(1).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
      .required(),
    isPrimary: Joi.boolean().required(),
  }).required(),
}).required();

// LOGIN schema
const loginSchema = Joi.object({
  auth: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
      .required(),
  }).required(),
}).required();

// PRODUCT schema

const productSchema = Joi.object({
  product: {
    name: Joi.string().min(1).required(),
    description: Joi.string().min(20).max(350).required(),
    unitAmount: Joi.number().min(0).max(100000).required(),
    numberInStock: Joi.number().min(0).required(),
    imageDataUrl: Joi.string().dataUri().required(),
    category: Joi.string()
      .custom(isValidObjId, "Mongodb objectId validation")
      .required(),
  },
}).required();
const productPatchSchema = Joi.object({
  product: Joi.object({
    name: Joi.string().min(1),
    description: Joi.string().min(20).max(350),
    unitAmount: Joi.number().min(0).max(100000),
    numberInStock: Joi.number().min(0),
    imageDataUrl: Joi.string().dataUri(),
    category: Joi.string().custom(isValidObjId, "Mongodb objectId validation"),
  }).min(1),
}).required();

// CATEGORY schema
const categorySchema = Joi.object({
  category: Joi.object({
    name: Joi.string().min(1).max(50).required(),
    imageDataUrl: Joi.string().dataUri().required(),
    description: Joi.string().min(20).max(350).required(),
  }).required(),
}).required();
const categoryPatchSchema = Joi.object({
  category: Joi.object({
    name: Joi.string().min(1).max(50),
    imageDataUrl: Joi.string().dataUri(),
    description: Joi.string().min(20).max(350),
  }).min(1),
}).required();

const dataValidator = (schema) => {
  return async (req, res, next) => {
    await schema.validateAsync(req.body, { abortEarly: false });
    console.log("data passed validation");
    next();
  };
};
module.exports = {
  dataValidator,
  adminSchema,
  loginSchema,
  productSchema,
  productPatchSchema,
  categorySchema,
  categoryPatchSchema,
  userSchema,
  userPatchSchema,
  userPasswordSchema,
  orderSchema,
  orderStatusSchema,
};
