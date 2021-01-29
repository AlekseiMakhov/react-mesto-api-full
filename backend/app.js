require('dotenv').config();
const express = require('express');
const { connect } = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const userRouter = require('./routes/users.js');
const cardsRouter = require('./routes/cards');
const auth = require('./middlewares/auth');

const app = express();
const { PORT = 80 } = process.env;

connect('mongodb://localhost:27017/mestodb', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/', userRouter);
app.use('/', cardsRouter);

// Обработка запроса несуществующего адреса
app.use('*', auth, (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.use((err, req, res) => {
  res.status(500).send({ message: 'На сервере произошла ошибка' });
});

app.listen(PORT);
