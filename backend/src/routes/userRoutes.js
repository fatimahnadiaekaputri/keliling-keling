const express = require('express');
const userController = require('../controllers/userController');
const {registerValidation, loginValidator} = require('../middlewares/validator');
const router = express.Router();

router.post('/register', registerValidation, userController.register);
router.post('/login', loginValidator, userController.login);

module.exports = router;

