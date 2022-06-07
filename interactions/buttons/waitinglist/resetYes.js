const configSchema = require('../../../schemas/config');

module.exports = async (json, client, Discord, int) => {
    if (int.user.id != json.data) return int.reply({ content: 'Hey buddy this is apparently not for you.', ephemeral: true })
    let configData = await configSchema.findOne({ guild: 'cosmic' });
    if (!configData) return int.message.edit({ content: "Oops can't find the specified data", components: [] })
    await configData.updateOne({ waitingList: [] });
    await require('../../../functions/updateWLEmbed')(Discord, client, int, wlMsg);
    return int.message.edit({ content: 'Successfully Annihilated everyone from the Waiting list!', components: [] });
}