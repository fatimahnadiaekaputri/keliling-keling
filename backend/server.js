
const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const cors = require('cors');
const PORT = process.env.PORT || 5000;
const db = require('./src/config/db');
const userRouter = require('./src/routes/userRoutes');
const articleRouter = require('./src/routes/articleRoutes');

app.use(cors());
app.use(express.json());

// connection test
db.raw('SELECT NOW()')
    .then((result) => {
        console.log('Database connected: ', result.rows || result);
    })
    .catch((err) => {
        console.error('Error connecting to database: ', err);
    });

// routes
app.get('/', (req, res) => {
  res.send('Test Backend Website Keliling-Keling!');
});

app.use('/api/user', userRouter);
app.use('/api/article', articleRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

