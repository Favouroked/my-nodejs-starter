const validator = require('../middlewares/inputValidation');

module.exports.setup = function setup(app, serviceLocator) {
  const fieldLists = {
    signup: ['email', 'password'],
    login: ['email', 'password'],
    verifyEmail: ['verificationCode', 'email'],
    createResetCode: ['email'],
    verifyResetCode: ['passwordResetCode', 'email'],
    createPassword: ['email', 'newPassword', 'verifyPassword'],
  };

  const userController = serviceLocator.get('userController');

  app.post('/api/users/signup', validator(fieldLists.signup), (req, res) => userController.signUp(req, res));
  app.post('/api/users/login', validator(fieldLists.login), (req, res) => userController.loginUser(req, res));
  app.post('/api/users/verify-email', validator(fieldLists.verifyEmail), (req, res) => userController.verifyEmail(req, res));
  app.post('/api/users/forgot-password', validator(fieldLists.createResetCode), (req, res) => userController.createResetCode(req, res));
  app.post('/api/users/verify-reset-code', validator(fieldLists.verifyResetCode), (req, res) => userController.verifyResetCode(req, res));
  app.post('/api/users/create-password', validator(fieldLists.createPassword), (req, res) => userController.createNewPassword(req, res));
};
