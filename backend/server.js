
const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const cors = require('cors');
const cookieParser = require("cookie-parser")
app.use(cookieParser())

const PORT = process.env.PORT || 5000;
const db = require('./src/config/db');
const userRouter = require('./src/routes/userRoutes');
const articleRouter = require('./src/routes/articleRoutes');
const umkmRouter = require('./src/routes/umkmRoutes');
const categoryRouter = require('./src/routes/categoryRoutes');
const villageRouter = require('./src/routes/villageRoutes');
const tourismRouter = require('./src/routes/tourismRoutes');

app.use(cors({
  origin: (origin, callback) => {
    callback(null, origin); // izinkan semua origin
  },
  credentials: true
}));

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
app.use('/api/umkm', umkmRouter);
app.use('/api/category', categoryRouter);
app.use('/api/village', villageRouter);
app.use('/api/tourism', tourismRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

