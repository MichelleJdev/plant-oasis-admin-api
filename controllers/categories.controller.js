const Category = require("../models/Category.model");
const cloudinary = require("../config/cloudinaryConfig");
const AppError = require("../utils/AppError");
const Product = require("../models/Product.model");

const createCategory = async (req, res, next) => {
  console.log(dummyMessage);
  const upload = await cloudinary.uploader.upload(
    req.body.category.imageDataUrl,
    { upload_preset: "mern_ecommerce" }
  );
  let newCategory = new Category({
    ...req.body.category,
    image: { publicId: upload.public_id, format: upload.format },
  });
  try {
    newCategory = await newCategory.save();
    return res.status(201).json({ message: "New category created" });
  } catch (error) {
    console.log("Failed to create product. Deleting product image");
    const { result } = await cloudinary.uploader.destroy(upload.public_id);
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  const foundCategories = await Category.find({});
  res.status(200).json(foundCategories);
};

const getCategoryById = async (req, res) => {
  const { id } = req.params;
  const foundCategory = await Category.findById(id);
  if (!foundCategory) throw new AppError(404, "Category not found");
  res.status(200).json({ category: foundCategory });
};

const patchUpdateCategory = async (req, res) => {
  const { id } = req.params;
  const { category } = req.body;
  if (!id) throw new AppError(401, "Invalid request");
  const foundCategory = await Category.findById(id);
  if (!foundCategory) throw new AppError(404, "Category not found");
  if (category.imageDataUrl) {
    const upload = await cloudinary.uploader.upload(category.imageDataUrl, {
      upload_preset: "mern_ecommerce",
      overwrite: true,
      public_id: foundCategory.image.publicId,
    });
    foundCategory.image = {
      format: upload.format,
      publicId: upload.public_id,
    };
  }
  for (let key in category) {
    if (key !== "imageDataUrl") {
      foundCategory[key] = category[key];
    }
  }
  console.log(foundCategory);
  const updatedCategory = await foundCategory.save();

  console.log(`Category updated: ${JSON.stringify(updatedCategory)}`);
  res.status(200).json(updatedCategory);
};

const deleteCategory = async (req, res, next) => {
  const { id } = req.params;
  if (!id) throw new AppError(400, "Bad request");
  const deletedCategory = await Category.findByIdAndDelete(id);
  await Product.deleteMany({ category: id });
  const { result } = await cloudinary.uploader.destroy(
    deletedCategory.image.publicId
  );
  res.status(200).json({ id: deletedCategory.id });
};

const renameCategory = async (req, res, next) => {
  const { name } = req.body.category;
  let foundCategory = await Category.findById(id);
  foundCategory.name = name;
  foundCategory = await foundCategory.save();
  res.status(200).json(foundCategory.name);
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  patchUpdateCategory,
  deleteCategory,
  renameCategory,
};
