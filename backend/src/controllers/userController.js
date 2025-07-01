const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const userModel = require('../models/userModel');

const register = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty())
        return res.status(400).json({errors: errors.array()});

    const {username, password, email, name, telephone } = req.body;

    // const existingUsername = await userModel.findUserByUsername(username);
    // if (existingUsername) {
    //     return res.status(409).json({message: 'Username already exists'});
    // }

    // const existingEmail = await userModel.findUserbyEmail(email);
    // if (existingEmail)
    //     return res.status(409).json({message: 'Email already exists'}) ;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
        user_id: uuidv4(),
        username,
        password: hashedPassword,
        email,
        name,
        telephone,
        role: 'admin',
    };

    await userModel.createUser(newUser);

    res.status(201).json({message: 'User registered successfully'});
};

module.exports = {register};