const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

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

        const token = jwt.sign(
            {
                user_id: user.user_id,
                username: user.username,
                role: user.role
            },
            process.env.JWT_SECRET, 
            { expiresIn: process.env.JWT_EXPIRES_IN}
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 24 * 60 * 60 *1000
        })

        const {password: _, ...userData} = user;
        res.status(200).json({message: 'Login berhasil', token, user: userData});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Terjadi kesalahan pada server'})
    }
};

const updateUser = async (req, res, next) => {
    try {
        const user_id = req.user.user_id;
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const user = await userModel.findUserById(user_id);
        if(!user) {
            return res.status(404).json({message: 'User not found'});
        }

        const { username, email, password, name, telephone } = req.body;
        const updateData = {};

        if (username && username !== user.username) {
            const existingUsername = await userModel.findUserByUsername(username);
            if (existingUsername && existingUsername.user_id !== user_id) {
                return res.status(409).json({message: 'Username sudah digunakan'});
            }

            updateData.username = username;
        }

        if (email && email !== user.email) {
            const existingEmail = await userModel.findUserbyEmail(email);
            if (existingEmail && existingEmail.user_id !== user_id) {
                return res.status(409).json({message: 'Email sudah digunakan'});
            }

            updateData.email = email;
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        if (name) updateData.name = name;
        if (telephone) updateData.telephone = telephone;

        if(Object.keys(updateData).length === 0) {
            return res.status(400).json({message: 'Tidak ada data yang diperbarui'})
        }

        const updated = await userModel.updateUserById(user_id, updateData);

        const {password: _, ...userData} = updated[0];

        res.json({message: 'User updated', data: userData});
    } catch (err) {
        next(err);
    }
};

const getCurrentUser = async (req, res) => {
    const user = await userModel.findUserById(req.user.user_id);
    if (!user) {
        return res.status(404).json({message: 'User not found'});
    }

    const { password, ...userData } = user;
    res.json(userData);
}

const logout = (req, res) => {
    res.clearCookie('token', {path: '/'});
    res.status(200).json({message: 'Logged out'});
};

const deleteUser = async (req, res, next) => {
    try {
        const user_id = req.user.user_id;

        const deletedCount = await userModel.deleteUserById(user_id);

        if (deletedCount === 0) {
            return res.status(404).json({message: 'User not found or already deleted'})
        }

        res.json({message: 'User account deleted successfully'});
    } catch (err) {
        next(err);
    }
}

module.exports = {register, login, updateUser, getCurrentUser, logout, deleteUser};