const router = require("express").Router();
const catchAsync = require("../utils/catchAsync");

// Controllers
const {
  createUser,
  getUsers,
  getUsersCount,
  getUserById,
  getUserChartData,
  patchUpdateUser,
  deleteUser,
  changeUserPassword,
} = require("../controllers/users.controller");

// Middleware
const {
  userSchema,
  userPatchSchema,
  userPasswordSchema,
  dataValidator,
} = require("../middleware/validations.middleware");

const { ensureNewUser } = require("../middleware/auth.middleware");

router
  .route("/")
  .get(catchAsync(getUsers))
  .post(
    catchAsync(dataValidator(userSchema)),
    catchAsync(ensureNewUser),
    catchAsync(createUser)
  );

router.get("/count", catchAsync(getUsersCount));

router.get("/chart-data", catchAsync(getUserChartData));
router.patch(
  "/password/:id",
  catchAsync(dataValidator(userPasswordSchema)),
  catchAsync(changeUserPassword)
);

router
  .route("/:id")
  .get(catchAsync(getUserById))
  .patch(
    catchAsync(dataValidator(userPatchSchema)),
    catchAsync(patchUpdateUser)
  )
  .delete(catchAsync(deleteUser));

module.exports = router;
