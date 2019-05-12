const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const config = require('./config/config');
const serviceLocator = require('./config/di');

const { dbUrl, env } = config;

// eslint-disable-next-line no-console
mongoose.connect(dbUrl, { useNewUrlParser: true }).then(() => (env !== 'test' ? console.log('Connected to DB') : null));
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

const userApi = require('./api/userApi');

const app = express();

if (env !== 'test') {
  app.use(logger('combined'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

userApi.setup(app, serviceLocator);

module.exports = app;
