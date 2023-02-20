const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ValidationError = require('mongoose/lib/error/validation');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const MyValidationError = require('../errors/my-validation-err');
const ConflictError = require('../errors/conflict-err');
const AuthError = require('../errors/auth-err');
const { NODE_ENV, JWT_SECRET } = require('../config');

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
      delete user.password;
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new MyValidationError('Переданы некорректные данные при создании пользователя'));
        return;
      }
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с такой почтой уже зарегистрирован'));
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
        throw new NotFoundError('Пользователь не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name instanceof ValidationError) {
        next(new MyValidationError('Переданы некорректные данные при обновлении профиля'));
        return;
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findOne({ email }).select('+password')
    .then((user) => {
      const passwordCheck = bcrypt.compare(password, user.password);
      if (!user || !passwordCheck) {
        throw new AuthError('Неправильная почта или пароль');
      }
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ token, name: user.name, email: user.email });
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
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
