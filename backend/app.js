require('dotenv').config();
const express = require('express');
const { connect } = require('mongoose');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const auth = require('./middlewares/auth');

const allowedCors = [
  'https://chosen.students.nomoredomains.rocks',
  'http:/chosen.students.nomoredomains.rocks',
  'localhost:3000',
];

const app = express();
const { PORT = 3000 } = process.env;

connect('mongodb://localhost:27017/mestodb', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use((req, res, next) => {
  const { origin } = req.headers;
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  next();
});

app.use(cookieParser());
app.use(express.json());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/', userRouter); // Обработка запроса пользователей
app.use('/', cardsRouter); // Обработка запроса карточек

// Обработка запроса несуществующего адреса
app.use('*', auth, (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.use((err, req, res) => {
  res.status(500).send({ message: 'На сервере произошла ошибка' });
});

app.listen(PORT);
