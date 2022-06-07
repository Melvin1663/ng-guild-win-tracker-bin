const get = require('node-fetch2');

module.exports = {
	name: 'req',
	description: 'Checks if the player specified meets the minimum requirements to join Cosmic',
	options: [
		{
			name: 'player',
			description: 'The IGN of the player you want to check',
			type: 'STRING',
			required: true
		}
	],
	run: async (int, Discord, client, args) => {
		try {
			if (!int.deffered && !int.replied) await int.deferReply().catch(console.log)

			let player = await get(`https://api.ngmc.co/v1/players/${encodeURIComponent(args[0])}`, { headers: { "Authorization": client.ngKey } }).catch(console.log)
			if (!player) return int.editReply(`An Unknown Error occured`)
			if (player ?.status != 200) return int.editReply(`(Player not found) Error ${player ?.status}: ${player ?.statusText}`).catch(console.log)
			player = await player.json();

			let status = 0;
			let reqs = {
				statusCredits: 10000,
				kills: 5500,
				level: 150,
				wins: 1500
			}
			let mean = {
				statusCredits: 'Credits',
				kills: 'Kills',
				level: 'Level',
				wins: 'Wins'
			}
			let res = [];
			for (let req in reqs) {
				if (reqs[req] == player[req]) res.push(`<:green_tick:895211719608115221> **${mean[req]}:** ${player[req].toLocaleString()} (<:even:895216801758208050> 0)`)
				else if (reqs[req] < player[req]) res.push(`<:green_tick:895211719608115221> **${mean[req]}:** ${player[req].toLocaleString()} (<:up:895216801825300490> ${(player[req] - reqs[req]).toLocaleString()})`)
				else if (reqs[req] > player[req]) res.push(`<:red_x:895211784036835338> **${mean[req]}:** ${player[req].toLocaleString()} (<:down:895216801657540608> ${((player[req] - reqs[req]) - (player[req] - reqs[req]) * 2).toLocaleString()})`)
				else res.push(`⬛ **${mean[req]}:** ${player[req] ?.toLocaleString() ?? 0}`)
			}

			status = res.filter(i => i.includes('<:green_tick:895211719608115221>')).length

			let winsData = []
			for (let i in player.winsData) {
				winsData.push({ game: i, value: player.winsData[i] })
			}
			winsData.sort((a, b) => {
				const bandA = a.value
				const bandB = b.value

				let comparison = 0;
				if (bandA > bandB) comparison = 1;
				else if (bandA < bandB) comparison = -1;
				return comparison * -1;
			});

			int.editReply({
				embeds: [
					new Discord.MessageEmbed()
						.setAuthor('Cosmic Inc.', int.guild.iconURL({ dynamic: true, size: 1024 }))
						.setTitle(player.name)
						.setURL(`https://portal.nethergames.org/player/${encodeURIComponent(player.name)}`)
						.setThumbnail(`https://player.nethergames.org/avatar/${encodeURIComponent(player.name)}`)
						.addField(`${status == 4 ? 'Passed [4/4]' : `Failed [${status}/4]`}`, res.join('\n'))
						.setColor('FF55FF')
						.setFooter(`K/DR: ${(player.kills / player.deaths).toFixed(2)} | W/LR: ${(player.wins / player.losses).toFixed(2)} | Mains: ${winsData[0].game}`)
				]
			}).catch(console.log);
		} catch (e) {
			console.log(e)
		}
	}
}