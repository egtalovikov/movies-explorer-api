const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ValidationError = require('mongoose/lib/error/validation');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const MyValidationError = require('../errors/my-validation-err');
const ConflictError = require('../errors/conflict-err');
const AuthError = require('../errors/auth-err');
const { NODE_ENV, JWT_SECRET } = require('../utils/config');
const {
  CREATE_USER_ERROR, CONFLICT_USER_ERROR, USER_NOT_FOUND_ERROR, UPDATE_USER_ERROR, WRONG_AUTH_ERROR,
} = require('../utils/constants');

const createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new MyValidationError(CREATE_USER_ERROR));
        return;
      }
      if (err.code === 11000) {
        next(new ConflictError(CONFLICT_USER_ERROR));
        return;
      }
      next(err);
    });
};

const updateProfile = (req, res, next) => {
  const { email, name } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError(USER_NOT_FOUND_ERROR);
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name instanceof ValidationError) {
        next(new MyValidationError(UPDATE_USER_ERROR));
        return;
      }
      if (err.code === 11000) {
        next(new ConflictError(CONFLICT_USER_ERROR));
        return;
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError(WRONG_AUTH_ERROR);
      }
      bcrypt.compare(password, user.password)
        .then((match) => {
          if (!user || !match) {
            throw new AuthError(WRONG_AUTH_ERROR);
          }
          const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
          res.send({ token, name: user.name, email: user.email });
        })
        .catch(next);
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(USER_NOT_FOUND_ERROR);
      }
      res.send(user);
    })
    .catch(next);
};

module.exports = {
  createUser,
  updateProfile,
  login,
  getUserInfo,
};
