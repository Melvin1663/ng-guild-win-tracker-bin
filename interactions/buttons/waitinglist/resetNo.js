module.exports = (json, client, Discord, int) => {
    if (int.user.id != json.data) return int.reply({ content: 'Hey buddy this is apparently not for you.', ephemeral: true })
    return int.message.edit({ content: 'Alright, Lets pretend that never happened', components: [] });
}