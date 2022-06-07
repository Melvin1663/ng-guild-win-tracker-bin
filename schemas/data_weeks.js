const mongoose = require('mongoose');

module.exports = mongoose.model('dataWeeks', mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    localeDate: Object,
    dateMS: Number,
    data: Object,
    summary: Object,
    xp: Number
}), 'data_weeks');