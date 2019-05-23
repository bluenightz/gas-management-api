const jwt = require('jsonwebtoken');
const CONFIG = require('./config');


module.exports = {
  createToken(payload, secret, options) {
    return jwt.sign(payload, secret, options);
  },

  verifyToken(headersAuthorization) {
    return new Promise((resolve, reject) => {
      if (!headersAuthorization) {
        reject(new Error('Can\'t find Token'));
      } else {
        const token = headersAuthorization.replace('Bearer ', '');
        jwt.verify(token, CONFIG.SECRET, (err, decoded) => {
          if (err) {
            reject(err);
          } else {
            resolve(decoded);
          }
        });
      }
    });
  },
};
