const ValidationError = require('mongoose/lib/error/validation');
const CastError = require('mongoose/lib/error/cast');
const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const MyValidationError = require('../errors/my-validation-err');
const ForbiddenError = require('../errors/forbidden-err');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(
          new MyValidationError(
            'Переданы некорректные данные при создании фильма',
          ),
        );
        return;
      }
      next(err);
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new NotFoundError('Передан несуществующий _id фильма'))
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError(
          'Вы не можете удалить фильм другого пользователя',
        );
      }
      return movie.delete();
    })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err instanceof CastError) {
        next(new MyValidationError('Фильм с  указанным _id не найден'));
        return;
      }
      next(err);
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
