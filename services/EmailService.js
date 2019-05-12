
class EmailService {
  constructor(logger, mailgun) {
    this.logger = logger;
    this.mailgun = mailgun;
    this.sender = 'no-reply@onigbese.ng';
  }

  sendVerificationMail(email, verificationCode) {
    const body = `Your verification code is ${verificationCode}`;
    const subject = 'Onigbese Email Verification';
    const data = {
      from: this.sender,
      to: email,
      subject,
      html: body,
    };
    return this.mailgun.messages().send(data);
  }

  sendResetCode(email, resetCode) {
    const body = `Your password reset code is ${resetCode}`;
    const subject = 'Reset Password';
    const data = {
      from: this.sender,
      to: email,
      subject,
      html: body,
    };
    return this.mailgun.messages().send(data);
  }
}

module.exports = EmailService;
