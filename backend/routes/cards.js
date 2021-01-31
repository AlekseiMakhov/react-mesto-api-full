const router = require('express').Router();
const {
  createCard, deleteCard, getCards, likeCard, dislikeCard,
} = require('../controllers/cards');
const { cardValidator, idValidator } = require('../middlewares/dataValidator');

router.post('/cards', cardValidator, createCard);
router.get('/cards', getCards);
router.delete('/cards/:id', idValidator, deleteCard);
router.put('/cards/likes/:id', idValidator, likeCard);
router.delete('/cards/likes/:id', idValidator, dislikeCard);

module.exports = router;
