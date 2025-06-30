
const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config()

const cors = require('cors');
// const connectDB = require('./config/db');
// const router = require('./src/routes/routes');
const PORT = process.env.PORT || 5000;

// connectDB();

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

