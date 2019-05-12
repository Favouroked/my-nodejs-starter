/* eslint-disable */

process.env.NODE_ENV = 'test';
const chai = require('chai');

const { expect } = chai;

const UtilityService = require('../../services/UtilityService');

describe('Utility Service', () => {
  it('should return true if all fields are present', async () => {
    const data = { email: 'favouroked@gmail.com', password: 'favour' };
    const fieldlist = ['email', 'password'];
    const { status } = await UtilityService.validatePrams(data, fieldlist);
    expect(status).to.be.true;
  });

  it('should return false if some fields are absent', async () => {
    const data = { email: 'favouroked@gmail.com' };
    const fieldlist = ['email', 'password'];
    const { status } = await UtilityService.validatePrams(data, fieldlist);
    expect(status).to.be.false;
  });
});
