/* eslint-disable */

process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/onigbese-test-db', { useNewUrlParser: true }).then();
mongoose.set('useCreateIndex', true);
const chai = require('chai');

const serviceLocator = require('../../config/di');
const User = require('../../models/User');
const userService = serviceLocator.get('userService');

const { expect } = chai;

describe('User', () => {
  beforeEach((done) => {
    User.deleteMany({}, (err) => {
      done();
    });
  });

  describe('Service', () => {
    it('should create a new user', async () => {
      await userService.createUser({ email: 'favouroked@gmail.com', password: 'favour' });
      const user = await User.findOne({ email: 'favouroked@gmail.com' });
      expect(user).to.exist;
    });

    it('should should login a user', async () => {
      await userService.createUser({ email: 'favouroked@gmail.com', password: 'favour' });
      const { status } = await userService.validateUser({ email: 'favouroked@gmail.com', password: 'favour' });
      expect(status).to.be.true;
    });

    it('should not login user with wrong credentials', async() => {
      await userService.createUser({ email: 'favouroked@gmail.com', password: 'favour' });
      const { status } = await userService.validateUser({ email: 'favouroked@gmail.com', password: 'moses' });
      expect(status).to.be.false;
    });
  });
});
