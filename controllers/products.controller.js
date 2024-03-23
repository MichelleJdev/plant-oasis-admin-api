const Product = require("../models/Product.model");

const cloudinary = require("../config/cloudinaryConfig");
const AppError = require("../utils/AppError");
const mongoose = require("mongoose");

const getProductById = async (req, res) => {
  const { id } = req.params;
  const foundProduct = await Product.findById(id);
  if (!foundProduct) throw new AppError(404, "Product not found");
  res.status(200).json({ product: foundProduct });
};

const getProducts = async (req, res, next) => {
  const { category } = req.query;
  const filter = {};
  if (category) filter.category = { name: category };
  const products = await Product.find(filter);

  res.json(products);
};

const createProduct = async (req, res, next) => {
  const upload = await cloudinary.uploader.upload(
    req.body.product.imageDataUrl,
    { upload_preset: "mern_ecommerce", overwrite: true }
  );
  console.log("IMAGE UPLOAD: " + JSON.stringify(upload));
  const productData = { ...req.body.product };

  delete productData.imageFile;
  const newProduct = new Product({
    ...productData,
    image: { publicId: upload.public_id, format: upload.format },
  });
  try {
    await newProduct.save();
    console.log(`Product created: ${JSON.stringify(newProduct)}`);
    res.status(201).json({ data: newProduct });
  } catch (error) {
    console.log("Failed to create product. Deleting product image");
    const { result } = await cloudinary.uploader.destroy(upload.public_id);
    console.log(result);
    next(error);
  }
};

const patchUpdateProduct = async (req, res) => {
  const { id } = req.params;
  const { product } = req.body;
  if (!id) throw new AppError(401, "Invalid request");
  const foundProduct = await Product.findById(id);
  if (!foundProduct) throw new AppError(404, "Product not found");
  if (product.imageDataUrl) {
    const upload = await cloudinary.uploader.upload(product.imageDataUrl, {
      upload_preset: "mern_ecommerce",
      overwrite: true,
      public_id: foundProduct.image.publicId,
    });
    foundProduct.image = {
      format: upload.format,
      publicId: upload.public_id,
    };
  }
  for (let key in product) {
    if (key !== "imageDataUrl") {
      foundProduct[key] = product[key];
    }
  }
  const updatedProduct = await foundProduct.save();
  res.status(200).json(updatedProduct);
};

const getCartData = async (req, res) => {
  const productIds = req.body.productIds;
  const mongooseIds = productIds.map((id) => mongoose.Types.ObjectId(id));
  const foundProducts = await Product.find({ id: { $in: mongooseIds } });
  res.status(200).json({ foundProducts });
};

const deleteProduct = async (req, res, next) => {
  const { id } = req.params;
  if (!id) throw new AppError(400, "Bad request");
  const deletedProduct = await Product.findByIdAndDelete(id);
  await cloudinary.uploader.destroy(deletedProduct.image.publicId);

  res.status(200).json({ id: deletedProduct.id });
};

const getProductCount = async (req, res, next) => {
  const productCount = await Product.countDocuments();
  res.status(200).json(productCount);
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  getCartData,
  patchUpdateProduct,
  deleteProduct,
  getProductCount,
};
