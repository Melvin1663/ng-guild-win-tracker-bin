const config = require('../../schemas/config');
const mongoose = require('mongoose')

module.exports = async (Discord, client) => {
    console.log(`Logged in as ${client.user.tag}`);
    client.user.setActivity('Cosmic players', { type: 'WATCHING' });
    // await client.application.commands.set([]).then(r => console.log(`${r.size} Slash command(s) are now loaded`));
    await client.guilds.cache.get('id').commands.set(client.interactions.post).then(r => {
        console.log(`${r.size} Interaction(s) loaded`)
    })
    let check = await config.findOne({ guild: 'cosmic' })
    if (!check) {
        console.error('CRITICAL ERROR: CONFIG DOCUMENT NOT FOUND')
        console.log('CREATING CONFIG DOCUMENT NOW');
        let nextSunday = require('../../functions/getNextSunday')()
        let month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let newConfig = new config({
            _id: mongoose.Types.ObjectId(),
            nextSunday: `${month[nextSunday.getMonth()]} ${nextSunday.getDate()}, ${nextSunday.getFullYear()}`,
            nextSundayMS: nextSunday.getTime(),
            retry: false,
            guild: 'cosmic',
            password: '922021',
            waitingList: [],
            waitingListMsg: 'N/A',
            waitingListChannel: 'N/A'
        })
    }
    await require('../../functions/log')(client);
}