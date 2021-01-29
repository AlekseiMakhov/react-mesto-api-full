const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const { NODE_ENV, JWT_SECRET } = process.env;

// добавление пользователя
module.exports.createUser = (req, res) => {
  const {
    email,
    password,
    name = 'Жак-Ив Кусто',
    about = 'Исследователь',
    avatar = 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      }
    });
};

module.exports.login = (req, res) => {
  const {
    email,
    password,
  } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production'
          ? JWT_SECRET
          : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

// запрос всех пользователей
module.exports.getUsers = (req, res) => User.find({})
  .then((user) => res.send({ data: user }))
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Ошибка запроса пользователей' });
    }
  });

// запрос пользователя по id
module.exports.getUser = (req, res) => User.findById(req.params.userId)
  .orFail(new Error('MyError'))
  .then((user) => res.send({ data: user }))
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные' });
      return;
    }
    if (err.message === 'MyError') {
      res.status(404).send({ message: 'Такого пользователя не существует' });
    } else {
      res.status(500).send({ message: 'Ошибка сервера' });
    }
  });

// обновление данных пользователя
module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .orFail(new Error('MyError'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'MyError') {
        res.status(404).send({ message: 'Такого пользователя не существует' });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      }
    });
};

// обновление аватара
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new Error('MyError'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'MyError') {
        res.status(404).send({ message: 'Такого пользователя не существует' });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      }
    });
};
