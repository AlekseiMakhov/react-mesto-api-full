require('dotenv').config();
const express = require('express');
const { connect } = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const userRouter = require('./routes/users.js');
const cardsRouter = require('./routes/cards');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users.js');
const NotFoundError = require('./errorTypes/NotFoundError.js');
const { errorLogger, requestLogger } = require('./middlewares/logger.js');

const app = express();
const { PORT = 3000 } = process.env;

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

app.use(requestLogger);

app.post('/signin', login);
app.post('/signup', createUser);
app.use('/', auth, userRouter);
app.use('/', auth, cardsRouter);

// Обработка запроса несуществующего адреса
app.all('*', (req, res, next) => next(new NotFoundError({ message: 'Ресурс не найден' })));

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT);
