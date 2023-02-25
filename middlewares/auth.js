const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-err');
const { NODE_ENV, JWT_SECRET } = require('../utils/config');
const { NEED_AUTH_ERROR, AUTH_ERROR } = require('../utils/constants');

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      next(new AuthError(NEED_AUTH_ERROR));
      return;
    }

    const token = extractBearerToken(authorization);
    const payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');

    req.user = payload;
  } catch (err) {
    next(new AuthError(AUTH_ERROR));
    return;
  }

  next();
};
