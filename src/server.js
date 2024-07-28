var express = require('express');
const cors = require('cors');
var app = express();
const connectDB = require('./Config/Connect');
const route = require('./routes/index');

app.use(cors({ origin: '*' }));

connectDB;

route(app);
// Start the server
// const port = process.env.PORT || 5000; 
// var server = app.listen(port, () => {
//   console.log(`Server đang chạy tại cổng ${port}`);
// });
app.listen()
// module.exports = server;
