const mongoose = require('mongoose');
const playerSchema = require('../../../schemas/players');
const get = require('node-fetch2');

module.exports = {
  name: 'egg',
  description: 'Worship eggs',
  memberOnly: true,
  run: async (int, Discord, client, args) => {
    try {
      let channel = int.channel
      let user = int.user
      if (!int.deffered && !int.replied) await int.deferReply().catch(console.log)
      let check = await playerSchema.findOne({ userId: user.id });
      if (check) return int.editReply(`You're already known as \`${check.ign}\`, to unlink do /unegg`)
      int.editReply('Welcome to the Scociety of eggs! to continue your stay, please state your NetherGames **In-game** name')
      const collector = channel.createMessageCollector({ filter: m => m.author.id == user.id, max: 1, time: 30000 })
      let guild = await get('https://apiv2.nethergames.org/v1/guilds/cosmic', { headers: { "Authorization": client.ngKey } }).catch(e => console.log(e))
      if (guild ?.status != 200) return channel.send(`Woops cant fetch the guild: Error ${guild ?.status}`);
      guild = await guild.json();
      let playerList = guild.members.concat(guild.officers).concat([guild.leader]).map(i => i.toLowerCase())

      collector.on('collect', async m => {
        if (playerList.includes(m.content.toLowerCase())) {
          let idCheck = await playerSchema.findOne({ userId: m.author.id })
          if (idCheck) {
            await idCheck.updateOne({ ign: m.content.toLowerCase() })
            return m.channel.send(`Hello \`${m.content}\``)
          }
          const newPlayer = new playerSchema({
            _id: mongoose.Types.ObjectId(),
            userId: user.id,
            ign: m.content.toLowerCase(),
          })
          await newPlayer.save().catch(e => console.log(e))
          return m.channel.send(`Welcome to the society of eggs! \`${m.content}\``)
        } else return m.channel.send(`The player \`${m.content}\` is not in the Cosmic Guild.`)
      });
      collector.on('end', async col => {
        if (col.size == 0) return channel.send(`Looks like you didn't respond in time, you can try again tho`);
      })
    } catch (e) {
      console.log(e)
    }
  }
}