const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const studentRoutes = require('./routes/students');
const startCronJob = require('./cron/sync');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/students', studentRoutes);
const port=5000
mongoose.connect("mongodb://localhost:27017/", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server started ${port}`);
      startCronJob();
    });
  })
  .catch((err) => console.error('DB Connection Error:', err));