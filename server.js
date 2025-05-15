require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const stateRoutes = require('./routes/stateRoutes');
const PORT = process.env.PORT || 3500;

// Connect to Database
connectDB();
app.use(cors());
app.use(express.json());

// Static Files
app.use(express.static(path.join(__dirname, '/public')));

app.get(/^\/$|\/index(\.html)?$/, (req, res) => {
    //res.sendFile('./views/index.html', {root: __dirname});
    res.sendFile(path.join(__dirname, 'views', 'Index.html'));
});

// API Routes
app.use('/states', stateRoutes);

app.all(/^\/.*/, (req, res) => {
    // res.status(404).sendFile( path.join(__dirname, 'views', '404.html'));
    res.status(404);
    if(req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    }
    else if(req.accepts('json')) {
        res.json({error: '404 Not Found'});
    }
    else{
        res.type('txt').send('404 Not Found');
    }

});










mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});
