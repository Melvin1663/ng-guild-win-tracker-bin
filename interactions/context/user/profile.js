const playerSchema = require('../../../schemas/players');

module.exports = {
    name: 'Profile',
    description: 'Views the profile of a Discord User',
    run: async (int, Discord, client) => {
        let playerData = await playerSchema.findOne({ userId: int.targetId });
        if (!playerData) return int.reply({ content: "This person didn't use the `/egg` command I guess.", ephemeral: true });
        return await require('../../../interactions/commands/info/profile').run(int, Discord, client, [`${playerData.ign}`])
    }
}