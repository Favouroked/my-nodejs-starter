const EventEmitter = require('events');

class EmailEvents {
  constructor(logger, emailService) {
    this.logger = logger;
    this.emailService = emailService;
    this.events = new EventEmitter();
  }

  setup() {
    this.events.on('sendVerification', data => this.sendVerification(data));
    this.events.on('sendResetCode', data => this.sendResetCode(data));
    return this.events;
  }

  async sendVerification({ email, emailVerificationCode }) {
    const response = await this.emailService.sendVerificationMail(email, emailVerificationCode);
    this.logger.info(`Sent email verification for ${email}`);
    this.logger.info(response);
  }

  async sendResetCode({ email, passwordResetCode }) {
    const response = await this.emailService.sendResetCode(email, passwordResetCode);
    this.logger.info(response);
    this.logger.info(`Sent reset code for ${email}`);
  }
}

module.exports = EmailEvents;
