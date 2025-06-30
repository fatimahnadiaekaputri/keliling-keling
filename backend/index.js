
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const { Pool } = require('pg');
dotenv.config();

const cors = require('cors');
// const router = require('./src/routes/routes');
const PORT = process.env.PORT || 5000;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
})

pool.connect((err, client, release) => {
    if(err) {
        return console.error('Error acquiring client', err.stack);
    }
    client.query('SELECT NOW()', (err, result) => {
        release();
        if(err) {
            return console.error("Error executing query", err.stack);
        }
        console.log("Database connected: ", result.rows);
    });
});

app.use(cors());
app.use(express.json());

// routes
app.get('/', (req, res) => {
  res.send('Test Backend Website Keliling-Keling!');
});
// app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

