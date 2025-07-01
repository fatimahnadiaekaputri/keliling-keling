const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const userModel = require('../models/userModel');

const register = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty())
        return res.status(400).json({errors: errors.array()});

    const {username, password, email, name, telephone } = req.body;

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

const login = async (req, res) => {
    const {username, password} = req.body;

    try {
        const user = await userModel.findUserByUsername(username);

        if (!user) {
            return res.status(404).json({message: 'Username is not found'});
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if(!validPassword) {
            return res.status(401).json({message: 'Wrong password'});
        }

        const {password: _, ...userData} = user;
        res.status(200).json({message: 'Login berhasil', user: userData});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Terjadi kesalahan pada server'})
    }
};

module.exports = {register, login};