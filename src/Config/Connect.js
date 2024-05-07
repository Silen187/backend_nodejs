var mysql = require('mysql');

var connectDB = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test',
});

module.exports = connectDB;
