const router = require('express').Router();
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');
const { NOT_FOUND_ERROR } = require('../utils/constants');

router.use('/', require('./auth'));

router.use(auth);

router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.use((req, res, next) => {
  next(new NotFoundError(NOT_FOUND_ERROR));
});

module.exports = router;
