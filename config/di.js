const winston = require('winston');
const mailgun = require('mailgun-js');

const config = require('./config');

const serviceLocator = require('../lib/serviceLocator');

const User = require('../models/User');
const UserService = require('../services/UserService');
const UserController = require('../controllers/UserController');

const UtilityService = require('../services/UtilityService');


const EmailService = require('../services/EmailService');
const EmailEvents = require('../subscribers/EmailEvents');

serviceLocator.register('logger', () => {
  const consoleTransport = new (winston.transports.Console)({
    datePattern: 'yyyy-MM-dd.',
    prepend: true,
    json: false,
    colorize: true,
    level: process.env.ENV === 'development' ? 'debug' : 'info',
  });
  const transports = [consoleTransport];
  // eslint-disable-next-line new-cap
  return new winston.createLogger({
    transports,
  });
});

serviceLocator.register('mailgun', () => {
  const { apiKey, domain } = config.mailgun;
  return mailgun({ apiKey, domain });
});

serviceLocator.register('emailService', (servicelocator) => {
  const logger = servicelocator.get('logger');
  const emailSender = servicelocator.get('mailgun');
  return new EmailService(logger, emailSender);
});

serviceLocator.register('emailEvents', (servicelocator) => {
  const logger = servicelocator.get('logger');
  const emailService = servicelocator.get('emailService');
  const emailEvents = new EmailEvents(logger, emailService);
  return emailEvents.setup();
});

serviceLocator.register('utilityService', () => UtilityService);

serviceLocator.register('userModel', () => User);

serviceLocator.register('userService', (servicelocator) => {
  const logger = servicelocator.get('logger');
  const model = servicelocator.get('userModel');
  const events = servicelocator.get('emailEvents');
  return new UserService(logger, model, events);
});

serviceLocator.register('userController', (servicelocator) => {
  const logger = servicelocator.get('logger');
  const service = servicelocator.get('userService');
  return new UserController(logger, service);
});

module.exports = serviceLocator;
