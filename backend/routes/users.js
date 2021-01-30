const router = require('express').Router();
const {
  getUsers, getUser, updateUser, updateAvatar, getCurrentUser,
} = require('../controllers/users');
const { idValidator, userValidator } = require('../middlewares/dataValidator');

router.get('/users', getUsers);
router.get('/users/me', userValidator, getCurrentUser);
router.get('/users/:userId', idValidator, getUser);
router.patch('/users/me', userValidator, updateUser);
router.patch('/users/me/avatar', userValidator, updateAvatar);

module.exports = router;
