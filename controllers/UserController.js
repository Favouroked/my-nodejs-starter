
class UserController {
  constructor(logger, userService) {
    this.logger = logger;
    this.userService = userService;
  }

  async signUp(req, res) {
    const user = await this.userService.createUser(req.body);
    const jwt = await this.userService.createJwt(user.id, user.email);
    res.json({ status: true, token: jwt });
  }

  async loginUser(req, res) {
    const { status, user } = await this.userService.validateUser(req.body);
    if (status) {
      const jwt = await this.userService.createJwt(user.id, user.email);
      res.json({ status: true, token: jwt });
    } else {
      res.json({ status: false, message: 'Invalid credentials' });
    }
  }

  async verifyEmail(req, res) {
    const status = await this.userService.verifyUser(req.body);
    res.json({ status, message: status ? 'Email Verification Successful' : 'Email Verification Failed' });
  }

  async createResetCode(req, res) {
    const status = await this.userService.createResetCode(req.body);
    res.json({ status, message: status ? 'Reset code sent' : 'User doesn\'t exist' });
  }

  async verifyResetCode(req, res) {
    const status = await this.userService.verifyResetCode(req.body);
    res.json({ status, message: status ? 'Reset Code correct' : 'Incorrect Reset Code' });
  }

  async createNewPassword(req, res) {
    const { newPassword, verifyPassword, email } = req.body;
    if (newPassword !== verifyPassword) {
      res.json({ status: false, message: 'The passwords do not match' });
    } else {
      const result = await this.userService.createPassword({ email, password: newPassword });
      if (result) {
        res.json({ status: true, message: 'Password Change Successful' });
      } else {
        res.json({ status: false, message: 'An error occurred' });
      }
    }
  }
}

module.exports = UserController;
