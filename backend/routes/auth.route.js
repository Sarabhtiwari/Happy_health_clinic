const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const routes = (app) => {
  app.post(
    "/hhc/api/v1/auth/signup",
    authMiddleware.validateAuthRequest,
    authController.signup,
  );

  app.post(
    "/hhc/api/v1/auth/signin",
    authMiddleware.validateSignInRequest,
    authController.signin,
  );
};

module.exports = routes;
