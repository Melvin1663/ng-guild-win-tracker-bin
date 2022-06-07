const mongoose = require('mongoose');
const dataSchema = require('../schemas/data_weeks');

module.exports = async (players, summary, guildXP) => {
    let month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    let time = new Date();
    let err = 0
    const newData = new dataSchema({
        _id: mongoose.Types.ObjectId(),
        localeDate: `${month[time.getMonth()]} ${time.getDate()}, ${time.getFullYear()}`,
        dateMS: time.getTime(),
        data: players,
        summary: summary,
        xp: guildXP
    })
    newData.save().catch(e => {
        console.log(`Error when saving data: ${e}`);
        if (e) err++
    })
    if (err == 0) return 0;
    if (err == 1) return 1;
}