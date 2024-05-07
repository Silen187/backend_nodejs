const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ModelCategory = new Schema({
    img: { type: String, default: '' },
    title: { type: String, default: '' },
    res: { type: String, default: '' },
});

module.exports = mongoose.model('category', ModelCategory);
