const db = require('../config/db');

const createUser = async (user) => {
    return await db('user').insert(user);
}

const findUserByUsername = async (username) => {
    return await db('user').where({username}).first();
}

const findUserbyEmail = async (email) => {
    return await db('user').where({email}).first();
}

const updateUserById = (user_id, data) => {
    return db('user').where({user_id}).update(data).returning('*');
};

const findUserById = (user_id) => {
    return db('user').where({user_id: user_id}).first();
}

const deleteUserById = async (user_id) => {
    return await db('user').where({user_id}).del();
};

module.exports = { findUserById, createUser, findUserByUsername, findUserbyEmail, updateUserById, deleteUserById };