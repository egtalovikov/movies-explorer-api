const ValidationError = require('mongoose/lib/error/validation');
const CastError = require('mongoose/lib/error/cast');
const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const MyValidationError = require('../errors/my-validation-err');
const ForbiddenError = require('../errors/forbidden-err');
const {
  CREATE_MOVIE_ERROR, MOVIE_ID_NOT_EXIST_ERROR, NOT_YOUR_MOVIE_ERROR, MOVIE_ID_NOT_FOUND,
} = require('../utils/constants');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

const createMovie = (req, res, next) => {
  Movie.create({ ...req.body, owner: req.user._id })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(
          new MyValidationError(CREATE_MOVIE_ERROR),
        );
        return;
      }
      next(err);
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new NotFoundError(MOVIE_ID_NOT_EXIST_ERROR))
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError(NOT_YOUR_MOVIE_ERROR);
      }
      return movie.delete();
    })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err instanceof CastError) {
        next(new MyValidationError(MOVIE_ID_NOT_FOUND));
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
