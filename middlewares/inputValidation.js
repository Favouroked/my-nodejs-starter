const UtilityService = require('../services/UtilityService');


module.exports = fieldsList => (req, res, next) => {
  const { status, message } = UtilityService.validatePrams(req.body, fieldsList);
  if (!status) {
    res.json({ status: false, message: `Some required fields are empty ${message}` });
  } else {
    next();
  }
};
