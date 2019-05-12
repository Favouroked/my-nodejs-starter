/* eslint-disable */

process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/onigbese-test-db', { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);
const chai = require('chai');


const User = require('../../models/User');

const { expect } = chai;


describe('User', () => {
  beforeEach((done) => {
    User.deleteMany({}, (err) => {
      done();
    });
  });

  describe('model', () => {
    it('it should not create a new user without email', async () => {
      let user = new User({ password: 'favour' });
      user = await user.save().catch((err) => {});
      expect(user).to.not.exist;
    });

    it('it should not create a new user without password', async () => {
      let user = new User({ email: 'favouroked@gmail.com' });
      user = await user.save().catch((err) => {});
      expect(user).to.not.exist;
    });

    it('it should create a new user', async () => {
      let user = new User({ email: 'favouroked@gmail.com', password: 'favour' });
      user = await user.save().catch(err => console.error('User create error', err));
      expect(user).to.exist;
    });

    it('it should hash password', async () => {
      let user = new User({ email: 'favouroked@gmail.com', password: 'favour' });
      user = await user.save().catch(err => console.error('User create error', err));
      expect(user.password).to.have.length.above(6);
    });
  });
});
