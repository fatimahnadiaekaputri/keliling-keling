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

module.exports = { createUser, findUserByUsername, findUserbyEmail };