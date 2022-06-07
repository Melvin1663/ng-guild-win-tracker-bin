const mongoose = require('mongoose');

module.exports = mongoose.model('Player Data', mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: String,
    ign: String,
}), 'players');