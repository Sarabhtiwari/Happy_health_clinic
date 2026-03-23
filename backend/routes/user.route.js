const userController = require('../controllers/user.controller')

const route = (app) => {
    app.post('/hhc/api/v1/user',userController.create);
}

module.exports = route;