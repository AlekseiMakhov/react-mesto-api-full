const { celebrate, Joi, CelebrateError } = require('celebrate');
const validator = require('validator');

const urlValidator = (value) => {
  if (!validator.isURL(value)) {
    throw new CelebrateError('Некорректный URL');
  }
  return value;
};

const cardValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().custom(urlValidator).required(),
  }),
});

const idValidator = celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24).hex(),
  }),
});

const authorizeValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
});

const userValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(100),
    avatar: Joi.string().custom(urlValidator).required(),
  }),
});

module.exports = {
  cardValidator,
  idValidator,
  authorizeValidator,
  userValidator,
};
