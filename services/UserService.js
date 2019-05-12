const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UserService {
  constructor(logger, model, events) {
    this.logger = logger;
    this.model = model;
    this.events = events;
    this.jwtSecret = 'JAMES IS A FOOL';
  }

  async createUser({ email, password }) {
    const user = await this.model.create({ email, password });
    if (process.env.NODE_ENV !== 'test') {
      const { emailVerificationCode } = user;
      this.events.emit('sendVerification', { email, emailVerificationCode });
    }
    return user;
  }

  async validateUser({ email, password }) {
    const user = await this.model.findOne({ email });
    if (user) {
      const result = await bcrypt.compare(password, user.password);
      const response = { status: result };
      if (result) {
        response.user = user;
      }
      return response;
    }
    return { status: false };
  }

  async verifyUser({ verificationCode, email }) {
    const user = await this.model.findOne({ email });
    if (parseInt(verificationCode, 10) === parseInt(user.emailVerificationCode, 10)) {
      await this.model.findByIdAndUpdate(user.id, { emailVerified: true });
      return true;
    }
    return false;
  }

  async createResetCode({ email }) {
    const user = await this.model.findOne({ email });
    if (user) {
      const passwordResetCode = Math.floor(100000 + Math.random() * 900000);
      await this.model.findByIdAndUpdate(user.id, { passwordResetCode });
      if (process.env.NODE_ENV !== 'test') {
        this.events.emit('sendResetCode', { email, passwordResetCode });
      }
      return true;
    }
    return false;
  }

  async verifyResetCode({ passwordResetCode, email }) {
    const user = await this.model.findOne({ email });
    if (user) {
      const status = user.passwordResetCode === parseInt(passwordResetCode, 10);
      if (status) {
        await this.model.findOneAndUpdate({ email }, { passwordIsReset: true });
        return status;
      }
    }
    return false;
  }

  async createPassword({ email, password }) {
    const user = await this.model.findOne({ email });
    if (user && user.passwordIsReset) {
      const hash = await bcrypt.hash(password, 10);
      await this.model.findByIdAndUpdate(user.id, { password: hash });
      return true;
    }
    return false;
  }

  createJwt(id, email) {
    return jwt.sign({ id, email }, this.jwtSecret);
  }
}

module.exports = UserService;
