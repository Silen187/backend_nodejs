var mysql = require('mysql');

var connectDB = mysql.createPool({
    host: '103.56.158.31',
    user: 'tuyendungUser',
    password: 'sinhvienBK',
    database: 'ThongTinTuyenDung',
    port: 3306
});

module.exports = connectDB;
