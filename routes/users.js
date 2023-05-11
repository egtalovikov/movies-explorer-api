const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  updateProfile, getUserInfo,
} = require('../controllers/users');

router.get('/me', getUserInfo);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);

module.exports = router;
