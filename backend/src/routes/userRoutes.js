const express = require('express');
const userController = require('../controllers/userController');
const {registerValidation, loginValidator, updateValidation} = require('../middlewares/validator');
const { authenticate } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register', registerValidation, userController.register);
router.post('/login', loginValidator, userController.login);
router.put('/me', authenticate, updateValidation, userController.updateUser);
router.get('/me', authenticate, userController.getCurrentUser)
router.post('/logout', userController.logout);
router.delete('/me', authenticate, userController.deleteUser)

module.exports = router;

