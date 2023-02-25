const CREATE_MOVIE_ERROR = 'Переданы некорректные данные при создании фильма';
const MOVIE_ID_NOT_EXIST_ERROR = 'Передан несуществующий _id фильма';
const NOT_YOUR_MOVIE_ERROR = 'Вы не можете удалить фильм другого пользователя';
const MOVIE_ID_NOT_FOUND = 'Фильм с  указанным _id не найден';
const CREATE_USER_ERROR = 'Переданы некорректные данные при создании пользователя';
const CONFLICT_USER_ERROR = 'Пользователь с такой почтой уже зарегистрирован';
const USER_NOT_FOUND_ERROR = 'Пользователь не найден';
const UPDATE_USER_ERROR = 'Переданы некорректные данные при обновлении профиля';
const WRONG_AUTH_ERROR = 'Неправильная почта или пароль';
const NEED_AUTH_ERROR = 'Необходима авторизация';
const AUTH_ERROR = 'Что-то пошло не так при авторизации';
const SERVER_ERROR = 'На сервере произошла ошибка';
const WRONG_EMAIL_ERROR = 'Неправильный формат почты';
const NOT_FOUND_ERROR = 'Указан неправильный путь';

module.exports = {
  CREATE_MOVIE_ERROR,
  MOVIE_ID_NOT_EXIST_ERROR,
  NOT_YOUR_MOVIE_ERROR,
  MOVIE_ID_NOT_FOUND,
  CREATE_USER_ERROR,
  CONFLICT_USER_ERROR,
  USER_NOT_FOUND_ERROR,
  UPDATE_USER_ERROR,
  WRONG_AUTH_ERROR,
  NEED_AUTH_ERROR,
  AUTH_ERROR,
  SERVER_ERROR,
  WRONG_EMAIL_ERROR,
  NOT_FOUND_ERROR,
};
