const get = require('node-fetch2')
const playerSchema = require('../../../schemas/players')
const dataSchema = require('../../../schemas/data_weeks');

module.exports = {
  name: 'profile',
  description: 'Check a cosmic players profile',
  options: [
    {
      name: 'player',
      description: 'The cosmic players in-game name',
      required: false,
      type: 'STRING'
    }
  ],
  memberOnly: false,
  run: async (int, Discord, client, args) => {
    try {
      if (!int.deffered && !int.replied) await int.deferReply().catch(console.log)
      let month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			let lastData;
			let t = new Date();
			let sundays = require('../../../functions/getSundays')(month.indexOf(month[new Date().getMonth()]), new Date().getFullYear());
			let sTime1 = new Date(`${month[new Date().getMonth()]} ${sundays[args[1] - 1]}, ${new Date().getFullYear()}`).getTime();
			let sTime2 = new Date(sTime1 - 604800000);
			t.setDate(t.getDate() - t.getDay());
			lastData = await dataSchema.findOne({ localeDate: `${month[t.getMonth()]} ${t.getDate()}, ${t.getFullYear()}` });
			let playerIGN;
      if (!args.length) {
        let a = await playerSchema.findOne({ userId: int.user.id })
        playerIGN = a.ign
      } else playerIGN = args[0]
      if (!playerIGN) return int.editReply("Player not found | Tip: Do `/egg` to no longer type your ign");
      let guild = await get('https://api.ngmc.co/v1/guilds/cosmic', { headers: { "Authorization": client.ngKey } }).catch(console.log)
      if (guild ?.status != 200) return int.editReply(`(Guild not found) Error ${guild ?.status}: ${guild ?.statusText}`);
      guild = await guild.json();
      let playerList = guild.members.concat(guild.officers).concat(client.guildLeaders);
      let player = await get(`https://api.ngmc.co/v1/players/${playerIGN}`, { headers: { "Authorization": client.ngKey } }).catch(e => console.log(e))
      if (player ?.status != 200) return int.editReply(`(Player not found) Error ${player ?.status}: ${player ?.statusText}`)
      player = await player.json();
      if (!playerList.includes(player.name)) return int.editReply("That's not a Cosmic player").catch(console.log)
      let playerNames = await playerSchema.findOne({ ign: player.name.toLowerCase() })

      let enumVote = ['❌', '✔', '✅']
      const colorCodes = {
        '§4': '<:darkred:872103440128565299>',
        '§c': '<:red:872103439839154207>',
        '§6': '<:gold:872103440099196979>',
        '§e': '<:yellow:872103439985963039>',
        '§2': '<:darkgreen:872103440426340384>',
        '§a': '<:green:872103439780413531>',
        '§b': '<:aqua:872103439981756436>',
        '§3': '<:darkaqua:872103439914651709>',
        '§1': '<:darkblue:872103440023687198>',
        '§9': '<:blue:872103439952392222>',
        '§d': '<:lightpurple:872103440329871390>',
        '§5': '<:darkpurple:872103439918858240>',
        '§f': '<:white:872103439914663996>',
        '§7': '<:grey:872103439763656745>',
        '§8': '<:darkgray:872103439809773679>',
        '§0': '<:black:872103439793029191>'
      }

      let embed = new Discord.MessageEmbed()
        .setAuthor(`Cosmic Inc.`, int.guild.iconURL({ dynamic: true, size: 1024 }))
        .setTitle(`${player.name} ${enumVote[player.voteStatus ?? 0]}`)
        .setURL(`https://portal.nethergames.org/player/${encodeURIComponent(player.name)}`)
        .setDescription(player.bio ? player.bio.substring(0, 4000) : '**__No Bio__**')
        .setThumbnail(`https://player.nethergames.org/avatar/${encodeURIComponent(player.name)}`)
        .addFields(
          {
            name: '<:NG:890036495681982475> NetherGames',
            value: `**Level:** ${player.level}\n` +
              `**XP:** ${player.xp.toLocaleString()}\n` +
              `**Ranks:** ${player.ranks.length ? player.ranks.join(', ') : '**__No Ranks__**'}\n` +
              `**Tier:** ${player.tier ?? '**__No Tier__**'}\n` +
              `**K/D:** (${((player.kills / player.deaths) ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}) ${((player.kills / player.deaths) ?? 0).toLocaleString(undefined, { minimumFractionDigits: 5 })}\n` +
              `**Kills:** ${player.kills.toLocaleString()}\n` +
              `**Kill Rate:** ${Math.trunc((player.kills / (player.kills + player.deaths)) * 100)}%\n` +
              `**Deaths:** ${player.deaths.toLocaleString()}\n` +
              `**W/L:** (${((player.wins / player.losses) ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}) ${((player.wins / player.losses) ?? 0).toLocaleString(undefined, { minimumFractionDigits: 5 })}\n` +
              `**Wins:** ${player.wins.toLocaleString()}\n` +
              `**Win Rate:** ${Math.trunc((player.wins / (player.wins + player.losses)) * 100)}%\n` +
              `**Losses:** ${player.losses.toLocaleString()}\n` +
              `**Guild:** [${player.guild ?? "N/A"}](https://portal.nethergames.org/guild/${player.guild})\n` +
              `**Credits:** ${player.statusCredits.toLocaleString()}`,
            inline: true
          },
          {
            name: '🌙 Cosmic',
            value: `**Position:** ${guild.members.includes(player.name) ? 'Guild Member' : (guild.officers.includes(player.name) ? 'Guild Officer' : (client.guildLeaders.includes(player.name) ? 'Guild Leader' : 'Unknown'))}\n` +
              `**Tag:** ${guild.rawTag ?.startsWith('Â') ? colorCodes[guild.rawTag ?.slice(1, guild.rawTag ?.length - guild.tag.length)] : ''}${guild.tag}\n` +
              `**K/D SLW:** (${((lastData ?.data[player.name] ? player.kills - lastData.data[player.name].totalKills : 0) / (lastData ?.data[player.name] ? player.deaths - lastData.data[player.name].totalDeaths : 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}) ${((lastData ?.data[player.name] ? player.kills - lastData.data[player.name].totalKills : 0) / (lastData ?.data[player.name] ? player.deaths - lastData.data[player.name].totalDeaths : 0)).toLocaleString(undefined, { minimumFractionDigits: 5 })}\n` +
              `**Kills SLW:** ${(lastData ?.data[player.name] ? player.kills - lastData.data[player.name].totalKills : 0).toLocaleString()}\n` +
              `**Kill Rate SLW:** ${Math.trunc(((lastData ?.data[player.name] ? player.kills - lastData.data[player.name].totalKills : 0) / ((lastData ?.data[player.name] ? player.kills - lastData.data[player.name].totalKills : 0) + (lastData ?.data[player.name] ? player.deaths - lastData.data[player.name].totalDeaths : 0))) * 100)}%\n` +
              `**Deaths SLW:** ${(lastData ?.data[player.name] ? player.deaths - lastData.data[player.name].totalDeaths : 0).toLocaleString()}\n` +
              `**W/L SLW:** (${((lastData ?.data[player.name] ? player.wins - lastData.data[player.name].totalWins : 0) / (lastData ?.data[player.name] ? player.losses - lastData.data[player.name].totalLosses : 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}) ${((lastData ?.data[player.name] ? player.wins - lastData.data[player.name].totalWins : 0) / (lastData ?.data[player.name] ? player.losses - lastData.data[player.name].totalLosses : 0)).toLocaleString(undefined, { minimumFractionDigits: 5 })}\n` +
              `**Wins SLW:** ${(lastData ?.data[player.name] ? player.wins - lastData.data[player.name].totalWins : 0).toLocaleString()}\n` +
              `**Win Rate SLW:** ${Math.trunc(((lastData ?.data[player.name] ? player.wins - lastData.data[player.name].totalWins : 0) / ((lastData ?.data[player.name] ? player.wins - lastData.data[player.name].totalWins : 0) + (lastData ?.data[player.name] ? player.losses - lastData.data[player.name].totalLosses : 0))) * 100)}%\n` +
              `**Losses SLW:** ${(lastData ?.data[player.name] ? player.losses - lastData.data[player.name].totalLosses : 0).toLocaleString()}\n` +
              `**Win Req:** ${(lastData ?.data[player.name] ? ((player.extra.bwWins + player.extra.swWins + player.extra.tbWins) - (lastData.data[player.name].bw.totalWins + lastData.data[player.name].sw.totalWins + lastData.data[player.name].tb.totalWins) >= 30 ? 'Passed' : 'Pending') : 'No Data')}\n` +
              `**Discord:** ${playerNames ? `<@${playerNames.userId}>` : 'No Data#0000'}\n` +
              `**GXP SLW:** ${((lastData ?.data[player.name] ? player.wins - lastData.data[player.name].totalWins : 0) * 10).toLocaleString()}\n` +
              `**Credits SLW:** ${(lastData ?.data[player.name] ? player.statusCredits - lastData.data[player.name].totalCredits : 0).toLocaleString()}`,
            inline: true
          },
          { name: 'Joined NetherGames', value: `<t:${player.firstJoined ?? 0}> | <t:${player.firstJoined ?? 0}:R>` },
          { name: 'Last Log in', value: `<t:${player.lastJoined ?? 0}> | <t:${player.lastJoined ?? 0}:R>` }
        )
        .setColor('ORANGE')
        .setFooter(`${player.online == true ? 'Online' : 'Offline'} - ${player.online == true ? 'Playing on' : 'Last Seen on'} ${player.lastServer}`, player.online == true ? 'https://i.imgur.com/1YL8eQp.png' : 'https://i.imgur.com/8liJVh0.png')
        .setTimestamp()

      let buttons = []
      if (player.wins > 0) buttons.push(
        new Discord.MessageActionRow()
          .addComponents(
            new Discord.MessageButton()
              .setCustomId(JSON.stringify({
                cmd: 'profile',
                do: 'showWins',
                data: `${player.name}`
              }))
              .setLabel('Wins Summary')
              .setStyle('PRIMARY')
          )
      )

      return int.editReply({ embeds: [embed], components: buttons }).catch(console.log)
    } catch (e) {
      console.log(e)
    }
  }
}