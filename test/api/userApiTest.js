/* eslint-disable */

process.env.NODE_ENV = 'test';


const chai = require('chai');
const chaiHttp = require('chai-http');
const User = require('../../models/User');
const server = require('../../app');

const { expect } = chai;

chai.use(chaiHttp);

describe('User', () => {
  beforeEach((done) => {
    User.deleteMany({}, () => {
      done();
    });
  });

  describe('Controller', () => {
    beforeEach((done) => {
      const user = {
        email: 'favouroked@gmail.com',
        password: 'favour',
      };
      User.create(user, () => {
        done();
      });
    });

    afterEach((done) => {
      User.deleteMany({}, () => {
        done();
      });
    });

    it('should signup a user', (done) => {
      const user = {
        email: 'shadownthronedev@gmail.com',
        password: 'favour',
      };
      chai.request(server)
        .post('/api/users/signup')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('token');
          done();
        });
    });

    it('should verify user email', (done) => {
      User.findOne({ email: 'favouroked@gmail.com' })
        .then((user) => {
          const code = user.emailVerificationCode;
          const data = { verificationCode: code, email: 'favouroked@gmail.com' };
          chai.request(server)
            .post('/api/users/verify-email')
            .send(data)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('status');
              res.body.should.have.property('message');
              done();
            });
        });
    });

    it('should not verify user email', (done) => {
      const code = '111111';
      const data = { verificationCode: code, email: 'favouroked@gmail.com' };
      chai.request(server)
        .post('/api/users/verify-email')
        .send(data)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status');
          res.body.should.have.property('message');
          done();
        });
    });

    it('should create reset code', (done) => {
      const data = { email: 'favouroked@gmail.com' };
      chai.request(server)
        .post('/api/users/forgot-password')
        .send(data)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status');
          res.body.should.have.property('message');
          User.findOne(data)
            .then((user) => {
              expect(user.passwordResetCode).to.exist;
              done();
            });
        });
    });

    it('should verify reset code', (done) => {
      const userData = {
        email: 'shadowthronedev@gmail.com',
        password: 'favour',
        passwordResetCode: '123456',
      };
      User.create(userData)
        .then(() => {
          const data = { email: 'shadowthronedev@gmail.com', passwordResetCode: '123456' };
          chai.request(server)
            .post('/api/users/verify-reset-code')
            .send(data)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('status');
              res.body.status.should.be.true;
              res.body.should.have.property('message');
              User.findOne({ email: 'shadowthronedev@gmail.com' })
                .then((user) => {
                  expect(user.passwordIsReset).to.be.true;
                  done();
                });
            });
        });
    });

    it('should change password', (done) => {
      const userData = {
        email: 'shadowthronedev@gmail.com',
        password: 'favour',
        passwordIsReset: true,
      };
      User.create(userData)
        .then(() => {
          const data = { email: 'shadowthronedev@gmail.com', verifyPassword: 'favour', newPassword: 'favour' };
          chai.request(server)
            .post('/api/users/create-password')
            .send(data)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('status');
              res.body.status.should.be.true;
              res.body.should.have.property('message');
              done();
            });
        });
    });

    it('should not change password without password being reset', (done) => {
      const userData = {
        email: 'shadowthronedev@gmail.com',
        password: 'favour',
      };
      User.create(userData)
        .then(() => {
          const data = { email: 'shadowthronedev@gmail.com', verifyPassword: 'favour', newPassword: 'favour' };
          chai.request(server)
            .post('/api/users/create-password')
            .send(data)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('status');
              res.body.status.should.be.false;
              res.body.should.have.property('message');
              done();
            });
        });
    });

    it('should not change password if newPassword and verifyPassword don\'t match', (done) => {
      const userData = {
        email: 'shadowthronedev@gmail.com',
        password: 'favour',
        passwordIsReset: true,
      };
      User.create(userData)
        .then(() => {
          const data = { email: 'shadowthronedev@gmail.com', verifyPassword: 'favou', newPassword: 'favour' };
          chai.request(server)
            .post('/api/users/create-password')
            .send(data)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('status');
              res.body.status.should.be.false;
              res.body.should.have.property('message');
              done();
            });
        });
    });

    it('should login a user', (done) => {
      const user = {
        email: 'favouroked@gmail.com',
        password: 'favour',
      };
      chai.request(server)
        .post('/api/users/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('token');
          done();
        });
    });

    it('should not login a user', (done) => {
      const user = {
        email: 'favouroked@gmail.com',
        password: 'favou',
      };
      chai.request(server)
        .post('/api/users/login')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          done();
        });
    });
  });
});
