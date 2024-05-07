const express = require('express');
const router = express.Router();

const controllerWebsite = require('../Controller/ControllerWebsite');

router.get('/api/data', controllerWebsite.getData);
router.get('/api/search', controllerWebsite.SearchJobs);

module.exports = router;
