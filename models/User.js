const bcrypt = require('bcrypt');
const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  email: {
    type: String, index: true, unique: true, required: true,
  },
  password: { type: String, required: true },
  emailVerificationCode: String,
  emailVerified: Boolean,
  passwordResetCode: Number,
  passwordIsReset: { type: Boolean, default: false },
  authCode: String,
});

UserSchema.pre('save', async function save(next) {
  const { password } = this;
  this.emailVerificationCode = Math.floor(100000 + Math.random() * 900000);
  this.password = await bcrypt.hash(password, 10);
  next();
});

module.exports = model('User', UserSchema);
