const get = require('node-fetch2')
const playerSchema = require('../../../schemas/players')
const dataSchema = require('../../../schemas/data_weeks');

module.exports = {
	name: 'wins',
	description: 'See how many wins you got this week!',
	options: [
		{
			name: 'player',
			description: 'The Players IGN',
			type: 'STRING',
			required: false
		},
		{
			name: 'origin',
			description: 'Show where the player got the wins from',
			type: 'STRING',
			required: false,
			choices: [
				{ name: 'Yes', value: 'true' },
				{ name: 'No', value: 'false' }
			]
		}
	],
	memberOnly: true,
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
        playerIGN = a?.ign
      } else if (['true', 'false'].includes(args[0])) {
        let a = await playerSchema.findOne({ userId: int.user.id })
        playerIGN = a?.ign
      } else playerIGN = args[0]
      if (!playerIGN) return int.editReply("Player not found | Tip: Do `/egg` to no longer type your ign");
			let player = await get(`https://api.ngmc.co/v1/players/${playerIGN}`, { headers: { "Authorization": client.ngKey } }).catch(e => console.log(e))
      if (player ?.status != 200) return int.editReply(`(Player not found) Error ${player ?.status}: ${player ?.statusText}`)
      player = await player.json();

			if (!lastData?.data[player.name]) return int.editReply("That player doesn't seem to be in the database").catch(console.log)
			let origin = '';

			if (args[1] == 'true' || args[0] == 'true') {
				origin = `\n**${(lastData?.data[player.name] ? player.extra.bwWins - lastData.data[player.name].bw.totalWins : 0).toLocaleString()} Wins** from Bedwars`
				origin+= `\n**${(lastData?.data[player.name] ? player.extra.swWins - lastData.data[player.name].sw.totalWins : 0).toLocaleString()} Wins** from SkyWars`
				origin+= `\n**${(lastData?.data[player.name] ? player.extra.tbWins - lastData.data[player.name].tb.totalWins : 0).toLocaleString()} Wins** from The Bridge`
				origin+= `\n**${(lastData?.data[player.name] ? player.extra.cqWins - lastData.data[player.name].cq.totalWins : 0).toLocaleString()} Wins** from Conquest`
			}

			int.editReply({
				embeds: [
					new Discord.MessageEmbed()
						.setAuthor(player.name, player.avatar)
						.setDescription(`**${(lastData ?.data[player.name] ? (player.extra.bwWins + player.extra.swWins + player.extra.tbWins + player.extra.cqWins) - (lastData.data[player.name].bw.totalWins + lastData.data[player.name].sw.totalWins + lastData.data[player.name].tb.totalWins + lastData.data[player.name].cq.totalWins) : 0).toLocaleString()} Total Wins** since <t:${lastData.dateMS.toString().substring(0, lastData.dateMS.toString().length-3)}>${origin}`)
						.setColor('FF55FF')
				]
			}).catch(console.log)
		} catch (e) {
			console.log(e);
		}
	}
}