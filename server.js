require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const stateRoutes = require('./routes/stateRoutes');
const PORT = process.env.PORT || 3500;

// Connect to Database
connectDB();
app.use(cors());
app.use(express.json());

// API Routes
app.use('/states', stateRoutes);









mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});
