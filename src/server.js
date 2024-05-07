var express = require('express');
const cors = require('cors');
var app = express();
const connectDB = require('./Config/Connect');
const route = require('./route/index');

app.use(cors({ origin: 'http://localhost:3000' }));

connectDB;

route(app);
// Start the server
var server = app.listen(5000, function () {
    console.log('Server listening on port 5000');
});

module.exports = server;
