const express = require('express');
const router = express.Router();

const controllerWebsite = require('../Controller/ControllerWebsite');

// Thêm hàm sau khi code trong Controller
router.get('/api/id', controllerWebsite.getID); // Hàm lấy DataID
router.get('/api/search', controllerWebsite.SearchJobs); // Hàm tìm kiếm job + filter

module.exports = router;
