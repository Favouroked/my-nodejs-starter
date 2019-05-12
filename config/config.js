require('dotenv').config();

const env = process.env.NODE_ENV;
const config = {
  dbUrl: env === 'test' ? process.env.TEST_DB : process.env.LIVE_DB,
  env,
  jwtSecret: process.env.JWT_SECRET,
  mailgun: {
    domain: process.env.MAILGUN_DOMAIN,
    apiKey: process.env.MAILGUN_API_KEY,
  },
};

module.exports = config;
