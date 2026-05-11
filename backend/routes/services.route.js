const serviceController = require("../controllers/services.controller");
const authMiddleware = require("../middlewares/auth.middleware"); 
const adminMiddleware = require("../middlewares/admin.middleware"); 

const routes = (app) => {
    app.get("/hhc/api/v1/services", serviceController.getAllServices);

    app.post(
        "/hhc/api/v1/services", 
        authMiddleware.isAuthenticated, 
        adminMiddleware.isAdmin, 
        serviceController.createService
    );
}

module.exports = routes;