const User = require("../models/User.model");
const AppError = require("../utils/AppError");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 12;

const createUser = async (req, res, next) => {
  const { user } = req.body;
  bcrypt.hash(user.password, SALT_ROUNDS, async (err, hashedPass) => {
    try {
      if (err) return next(err);
      const newUser = new User({
        ...user,
        password: hashedPass,
        email: user.email.toLowerCase(),
      });

      const createdUser = await newUser.save();
      res.status(201).json({ user: createdUser });
    } catch (error) {
      next(error);
    }
  });
};

const getUsers = async (req, res) => {
  const foundUsers = await User.find({});
  res.status(200).json(foundUsers);
};
const getUsersCount = async (req, res, next) => {
  const usersCount = await User.countDocuments();
  res.status(200).json(usersCount);
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  const foundUser = await User.findById(id).select("-password");
  if (!foundUser) throw new AppError(404, "User not found");
  res.status(200).json(foundUser);
};

const getUserChartData = async (req, res) => {
  let { recency } = req.query;
  if (!recency) recency = 7;
  const currentDate = new Date();
  const startDate = new Date();
  const chartLabels = [];
  for (let i = recency - 1; i >= 0; i--) {
    const dayOfWeek = new Date();
    dayOfWeek.setDate(currentDate.getDate() - i);
    chartLabels.push(
      new Intl.DateTimeFormat("en-GB", {
        dateStyle: "medium",
      }).format(dayOfWeek)
    );
  }
  startDate.setDate(currentDate.getDate() - recency);
  const foundUsers = await User.find({
    createdAt: {
      $gte: startDate,
      $lt: currentDate,
    },
  });
  res.status(200).json({
    labels: chartLabels,
    users: foundUsers,
  });
};

const patchUpdateUser = async (req, res) => {
  const { id } = req.params;
  const { user } = req.body;
  if (!id) throw new AppError(401, "Invalid request");
  const foundUser = await User.findById(id);
  if (!foundUser) throw new AppError(404, "User not found");

  for (let key in user) {
    foundUser[key] = user[key];
  }
  const updatedUser = await foundUser.save();
  res.status(200).json(updatedUser);
};

const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  if (!id) throw new AppError(400, "Bad request");
  const deletedUser = await User.findByIdAndDelete(id);
  res.status(200).json({ id: deletedUser.id });
};

const changeUserPassword = async (req, res, next) => {
  const { password } = req.body.user;
  const { id } = req.params;
  const foundUser = await User.findById(id);
  bcrypt.hash(password, SALT_ROUNDS, async (err, hashedPass) => {
    try {
      if (err) return next(err);
      foundUser.password = hashedPass;
      await foundUser.save();
      res.sendStatus(201);
    } catch (error) {
      next(error);
    }
  });
};

module.exports = {
  createUser,
  getUsers,
  getUsersCount,
  getUserById,
  getUserChartData,
  patchUpdateUser,
  deleteUser,
  changeUserPassword,
};
