const Card = require('../models/Card');

// создание карточки
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Ошибка добавления карточки' });
      }
    });
};

// запрос всех карточек
module.exports.getCards = (req, res) => Card.find({})
  .populate(['owner', 'likes'])
  .then((card) => res.send({ data: card }))
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные' });
    }
  });

// удаление карточки
module.exports.deleteCard = (req, res) => Card.findByIdAndRemove(req.params.cardId)
  .orFail(new Error('MyError'))
  .then(() => res.send({ message: 'Карточка удалена' }))
  .catch((err) => {
    if (err.message === 'MyError') {
      res.status(404).send({ message: 'Такой карточки нет в базе' });
    } else { res.status(400).send({ message: 'Переданы некорректные данные' }); }
  });

// лайк
module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .orFail(new Error('MyError'))
  .populate(['owner', 'likes'])
  .then((card) => res.send({ data: card }))
  .catch((err) => {
    if (err.message === 'MyError') {
      res.status(404).send({ message: 'Такой карточки нет в базе' });
      return;
    }
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные' });
    }
  });

// дизлайк
module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .orFail(new Error('MyError'))
  .populate(['owner', 'likes'])
  .then((card) => res.send({ data: card }))
  .catch((err) => {
    if (err.message === 'MyError') {
      res.status(404).send({ message: 'Такой карточки нет в базе' });
      return;
    }
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные' });
    }
  });
