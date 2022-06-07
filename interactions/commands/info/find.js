const jaro = require('jaro-winkler');
const get = require('node-fetch2');

module.exports = {
  name: 'find',
  description: 'Forgot a cosmic players complete in-game name?',
  options: [
    {
      name: 'query',
      description: 'Search cosmic players through their partial ingame name',
      type: 'STRING',
      required: true
    }
  ],
  memberOnly: false,
  run: async (int, Discord, client, args) => {
    try {
      if (!int.deffered && !int.replied) await int.deferReply().catch(console.log)
    let guild = await get('https://api.ngmc.co/v1/guilds/cosmic', { headers: { "Authorization": client.ngKey } }).catch(e => console.log(e))
    if (guild ?.status != 200) return int.editReply(`(Guild not found) Error ${guild ?.status}: ${guild ?.statusText}`).catch(console.log)
    guild = await guild.json();
    let playerList = guild.members.concat(guild.officers).concat(client.guildLeaders)
    if (!playerList) return int.editReply(`There was an error trying to fetch the player list`).catch(console.log)
    let res = []
    playerList.forEach(c => {
      res.push({ name: c, value: jaro(c, args[0], { caseSensitive: false }) });
    })
    res.sort((a, b) => {
      const bandA = a.value
      const bandB = b.value

      let comparison = 0;
      if (bandA > bandB) comparison = 1;
      else if (bandA < bandB) comparison = -1;
      return comparison * -1;
    });
    res = res.slice(0, 10)
    let out = [];
    res.forEach(i => {
      out.push(`[${i.name}](https://portal.nethergames.org/player/${encodeURIComponent(i.name)}) - ${Math.trunc(i.value * 100)}%`)
    })

    int.editReply({
      embeds: [
        new Discord.MessageEmbed()
          .setColor('RANDOM')
          .setAuthor('Cosmic Inc.', int.guild.iconURL({ dynamic: true, size: 1024 }))
          .setTitle(`Results for ${args[0]}`)
          .setDescription(out.join('\n'))
      ]
    }).catch(console.log)
    } catch (e) {
      console.log(e)
    }
  }
}