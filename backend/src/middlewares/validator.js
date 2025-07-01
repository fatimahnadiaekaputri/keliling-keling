const { body, validationResult } = require('express-validator');
const userModel = require('../models/userModel');

const registerValidation = [
  // input validation
  body('username')
    .isLength({ min: 5, max: 50 })
    .withMessage('Username min 5 dan max 50 karakter'),

  body('password')
    .isLength({ min: 8, max: 100 }).withMessage('Password min 8 dan max 100 karakter')
    .matches(/[a-z]/).withMessage('Harus mengandung huruf kecil')
    .matches(/[A-Z]/).withMessage('Harus mengandung huruf besar')
    .matches(/\d/).withMessage('Harus mengandung angka'),

  body('email')
    .isEmail().withMessage('Email tidak valid'),

  body('name')
    .notEmpty().withMessage('Nama wajib diisi'),

  // check if username and email are unique
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { username, email } = req.body;

    const existingUsername = await userModel.findUserByUsername(username);
    if (existingUsername)
      return res.status(409).json({ message: 'Username sudah terdaftar' });

    const existingEmail = await userModel.findUserbyEmail(email);
    if (existingEmail)
      return res.status(409).json({ message: 'Email sudah terdaftar' });

    next();
  }
];

module.exports = { registerValidation };
