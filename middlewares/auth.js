const jwt = require('jsonwebtoken');

const { jwtSecret } = require('../config/config');

module.exports = (req, res, next) => {
  if (!req.get('Authorization')) {
    res.status(401).json({ status: 401, message: 'Invalid Authorization' }).end();
  } else {
    const token = req.get('Authorization');
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        res.status(401).end();
      } else {
        req.user = decoded;
        next();
      }
    });
  }
};
