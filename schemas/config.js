const mongoose = require('mongoose');

module.exports = mongoose.model('Configuration', mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nextSunday: String,
    nextSundayMS: Number,
    retry: Boolean,
    guild: String,
    password: String,
    waitingList: Array,
    waitingListMsg: String,
    waitingListChannel: String
}), 'config');