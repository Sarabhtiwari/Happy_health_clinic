const userController = require("../controllers/user.controller");
const userMiddleware = require("../middlewares/user.middleware");

const route = (app) => {
  app.post(
    "/hhc/api/v1/user",
    userMiddleware.validateCreateUserRequest,
    userController.create,
  );
};

module.exports = route;
