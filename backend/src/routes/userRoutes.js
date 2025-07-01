const express = require('express');
const userController = require('../controllers/userController');
const {registerValidation} = require('../middlewares/validator');
const router = express.Router();

router.post('/register', registerValidation, userController.register);

module.exports = router;

