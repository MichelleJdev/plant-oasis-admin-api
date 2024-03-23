const Admin = require("../models/Admin.model");
const bcrypt = require("bcrypt");

const createAdmin = async (req, res, next) => {
  const newAdmin = req.body.admin;
  const hashedPass = await bcrypt.hash(newAdmin.password, 12);
  let createdAdmin = new Admin({ ...newAdmin, password: hashedPass });
  createdAdmin = await createdAdmin.save();
  res.status(201).json({ newAdmin: createdAdmin });
};

const removeAdmin = async (req, res, next) => {
  const { id } = req.params;
  if (!id) return res.status(400).send({ message: "invalid admin id" });
  const admin = await Admin.findByIdAndDelete({ id });
  if (!admin)
    return res.status(404).send({ message: "admin with given id not found" });
  res.sendStatus(204);
};

const getAdmins = async () => {
  const admins = await Admin.find({});
  res.status(200).send({ data: admins });
};

module.exports = {
  createAdmin,
  removeAdmin,
  getAdmins,
};
