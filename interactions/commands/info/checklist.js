const dataSchema = require('../../../schemas/data_weeks');
const get = require('node-fetch2');
const tiny = require('tiny-json-http');

module.exports = {
	name: 'checklist',
	description: "See if someone doesn't pass the Win Req",
	options: [
		{
			name: 'get',
			type: 'SUB_COMMAND',
			description: 'Get the checklist on a specific time',
			options: [
				{
					name: 'month',
					description: 'What month do you want?',
					required: true,
					type: 'STRING',
					choices: [
						{ name: 'Current', value: 'Now' },
						{ name: 'January', value: 'Jan' },
						{ name: 'February', value: 'Feb' },
						{ name: 'March', value: 'Mar' },
						{ name: 'April', value: 'Apr' },
						{ name: 'May', value: 'May' },
						{ name: 'June', value: 'Jun' },
						{ name: 'July', value: 'Jul' },
						{ name: 'August', value: 'Aug' },
						{ name: 'September', value: 'Sep' },
						{ name: 'October', value: 'Oct' },
						{ name: 'November', value: 'Nov' },
						{ name: 'December', value: 'Dec' }
					]
				},
				{
					name: 'week',
					description: 'Hmmm what week?',
					required: true,
					type: 'STRING',
					choices: [
						{ name: 'Week 1', value: '1' },
						{ name: 'Week 2', value: '2' },
						{ name: 'Week 3', value: '3' },
						{ name: 'Week 4', value: '4' },
						{ name: 'Week 5', value: '5' }
					]
				},
				{
					name: 'year',
					description: 'Alrighty one last thing... What year?',
					required: true,
					type: 'STRING',
					choices: [
						{ name: 'Current', value: 'Now' },
						{ name: '2020', value: '2020' },
						{ name: '2021', value: '2021' },
						{ name: '2022', value: '2022' }
					]
				},
				{
					name: 'origin',
					description: 'Do you want to show where they got the wins from?',
					required: false,
					type: 'STRING',
					choices: [
						{ name: 'Yes', value: 'true' },
						{ name: 'No', value: 'false' }
					]
				},
				{
					name: 'sortby',
					description: 'Sorts the wins',
					required: false,
					type: 'STRING',
					choices: [
						{ name: 'Bedwars Wins', value: 'bw' },
						{ name: 'SkyWars Wins', value: 'sw' },
						{ name: 'TheBridge Wins', value: 'tb' },
						{ name: 'Conquest Wins', value: 'cq' }
					]
				}
			]
		},
		{
			name: 'now',
			description: 'Get the current checklist',
			type: 'SUB_COMMAND',
			options: [
				{
					name: 'origin',
					description: 'Do you want to show where they got the wins from?',
					required: false,
					type: 'STRING',
					choices: [
						{ name: 'Yes', value: 'true' },
						{ name: 'No', value: 'false' }
					]
				},
				{
					name: 'sortby',
					description: 'Sorts the wins',
					required: false,
					type: 'STRING',
					choices: [
						{ name: 'Bedwars Wins', value: 'bw' },
						{ name: 'SkyWars Wins', value: 'sw' },
						{ name: 'TheBridge Wins', value: 'tb' },
						{ name: 'Conquest Wins', value: 'cq' }
					]
				}
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
			let sundays = require('../../../functions/getSundays')(month.indexOf(args[0] == 'Now' ? month[new Date().getMonth()] : args[0]), args[2] == 'Now' ? new Date().getFullYear() : args[2]);
			// let sTime1 = new Date(`${args[0] == 'Now' ? month[new Date().getMonth()] : args[0]} ${(args[0] == 'Now' ? month[new Date().getMonth()] : args[0]) == 'Jan' ? sundays[args[1] - 1] - 2 : sundays[args[1] - 1]}, ${args[2] == 'Now' ? new Date().getFullYear() : args[2]}`).getTime();
			let sTime1 = new Date(`${args[0] == 'Now' ? month[new Date().getMonth()] : args[0]} ${sundays[args[1] - 1]}, ${args[2] == 'Now' ? new Date().getFullYear() : args[2]}`).getTime();
			let sTime2 = new Date(sTime1 - 604800000);
			if (int.options._subcommand == 'now') {
				t.setDate(t.getDate() - t.getDay());
				lastData = await dataSchema.findOne({ localeDate: `${month[t.getMonth()]} ${t.getDate()}, ${t.getFullYear()}` });
			} else if (int.options._subcommand == 'get') lastData = await dataSchema.findOne({ localeDate: `${month[sTime2.getMonth()]} ${sTime2.getDate()}, ${sTime2.getFullYear()}` })
			if (!lastData) return int.editReply("Couldn't find the specified data").catch(console.log)
			let guildRes = await get('https://api.ngmc.co/v1/guilds/cosmic?expand=true&withStats=true', { headers: { "Authorization": client.ngKey } }).catch(e => console.log(e))
			if (!guildRes) return int.editReply("Couldn't find Cosmic guild").catch(console.log)
			if (guildRes.status != 200) return int.editReply(`Error when fetching guild: ${guildRes.statusText}`).catch(console.log)
			guildRes = await guildRes.json();
			let res;
			if (int.options._subcommand == 'now') {
				res = guildRes.members.concat(guildRes.officers)
				res.push(guildRes.leader);
				res = { body: res }
			} else if (int.options._subcommand == 'get') {
				let n = new Date(`${args[0] == 'Now' ? month[new Date().getMonth()] : args[0]} ${sundays[args[1] - 1]}, ${args[2] == 'Now' ? new Date().getFullYear() : args[2]}`)
				let d = await dataSchema.findOne({ localeDate: `${month[n.getMonth()]} ${n.getDate()}, ${n.getFullYear()}` }).catch(e => console.log(e))
				if (!d) return int.editReply('Something went wrong when fetching data 2').catch(console.log)
				res = { body: d.data }
			}
			if (!res || !res.body) return int.editReply('Something went wrong when fetching members').catch(console.log)
			let pass = [];
			let fail = [];
			let noData = [];
			if (int.options._subcommand == 'now') {
				res.body.forEach(p => {
					if (lastData.data[p.name]) {
						let lp = lastData.data[p.name];
						let gWins = p.extra?.bwWins + p.extra?.swWins + p.extra?.tbWins + p.extra?.cqWins;
						let pgWins = (lp.bw ?.totalWins ?? 0) + (lp.sw ?.totalWins ?? 0) + (lp.tb ?.totalWins ?? 0) + (lp.cq ?.totalWins ?? 0)
						if ((gWins - pgWins) >= 30) pass.push(
							{
								name: p.name,
								value: gWins - pgWins,
								bw: p.extra?.bwWins - (lp.bw ?.totalWins ?? 0),
								sw: p.extra?.swWins - (lp.sw ?.totalWins ?? 0),
								tb: p.extra?.tbWins - (lp.tb ?.totalWins ?? 0),
								cq: p.extra?.cqWins - (lp.cq ?.totalWins ?? 0)
							}
						);
						else fail.push(
							{
								name: p.name,
								value: gWins - pgWins,
								bw: p.extra?.bwWins - (lp.bw ?.totalWins ?? 0),
								sw: p.extra?.swWins - (lp.sw ?.totalWins ?? 0),
								tb: p.extra?.tbWins - (lp.tb ?.totalWins ?? 0),
								cq: p.extra?.cqWins - (lp.cq ?.totalWins ?? 0)
							}
						);
					} else noData.push({ name: p.name, value: 0, bw: 0, sw: 0, tb: 0, cq: 0 });
				})
			} else if (int.options._subcommand == 'get') {
				for (let i in res.body) {
					let p = lastData.data[i]
					let l = res.body[i]
					if (p) {
						let gWins = (l.bw ?.totalWins ?? 0) + (l.sw ?.totalWins ?? 0) + (l.tb ?.totalWins ?? 0) + (l.cq ?.totalWins ?? 0)
						let pgWins = (p.bw ?.totalWins ?? 0) + (p.sw ?.totalWins ?? 0) + (p.tb ?.totalWins ?? 0) + (p.cq ?.totalWins ?? 0)
						if ((gWins - pgWins) >= 30) pass.push(
							{
								name: i,
								value: gWins - pgWins,
								bw: l.bw ?.totalWins - p.bw ?.totalWins,
								sw: l.sw ?.totalWins - p.sw ?.totalWins,
								tb: l.tb ?.totalWins - p.tb ?.totalWins,
								cq: l.cq ?.totalWins - p.cq ?.totalWins 
							}
						);
						else fail.push(
							{
								name: i,
								value: gWins - pgWins,
								bw: (l.bw ?.totalWins ?? 0) - (p.bw ?.totalWins ?? 0),
								sw: (l.sw ?.totalWins ?? 0) - (p.sw ?.totalWins ?? 0),
								tb: (l.tb ?.totalWins ?? 0) - (p.tb ?.totalWins ?? 0),
								cq: (l.cq ?.totalWins ?? 0) - (p.cq ?.totalWins ?? 0)
							}
						);
					} else noData.push({ name: i, value: 0, bw: 0, sw: 0, tb: 0, cq: 0 })
				}
			}

			pass.sort((a, b) => {
				let bandA;
				let bandB;
				let sort;

				if (args.length) {
					let search = ['bw', 'sw', 'tb', 'cq']
					switch (int.options._subcommand) {
						case 'now': {
							if (search.includes(args[0])) sort = args[0]
							else if (search.includes(args[1])) sort = args[1]
						}; break;
						case 'get': {
							if (search.includes(args[3])) sort = args[3]
							else if (search.includes(args[4])) sort = args[4]
						}
					}
				}

				if (sort) {
					bandA = a[sort]
					bandB = b[sort]
				} else {
					bandA = a.value
					bandB = b.value
				}

				let comparison = 0;
				if (bandA > bandB) comparison = 1;
				else if (bandA < bandB) comparison = -1;
				return comparison * -1;
			});
			fail.sort((a, b) => {
				let bandA;
				let bandB;
				let sort;

				if (args.length) {
					let search = ['bw', 'sw', 'tb', 'cq']
					switch (int.options._subcommand) {
						case 'now': {
							if (search.includes(args[0])) sort = args[0]
							else if (search.includes(args[1])) sort = args[1]
						}; break;
						case 'get': {
							if (search.includes(args[3])) sort = args[3]
							else if (search.includes(args[4])) sort = args[4]
						}
					}
				}

				if (sort) {
					bandA = a[sort]
					bandB = b[sort]
				} else {
					bandA = a.value
					bandB = b.value
				}

				let comparison = 0;
				if (bandA > bandB) comparison = 1;
				else if (bandA < bandB) comparison = -1;
				return comparison * -1;
			});
			noData.sort((a, b) => {
				let bandA = a.value
				let bandB = b.value

				let comparison = 0;
				if (bandA > bandB) comparison = 1;
				else if (bandA < bandB) comparison = -1;
				return comparison * -1;
			});
			let resPass = [];
			let resFail = [];
			let resNoData = [];
			let totWins = 0;
			let bwWins = 0;
			let swWins = 0;
			let tbWins = 0;
			let cqWins = 0;
			[pass, fail].forEach(arr => {
				arr.forEach(i => {
					totWins += i.value;
					bwWins += i.bw;
					swWins += i.sw;
					tbWins += i.tb;
					cqWins += i.cq;
				})
			})
			let circle = ['🔴', '🔴', '🔴', '🔴', '🔴', '🔴', '🔴', '🔴', '🔴', '🟠', '🟠', '🟠', '🟠', '🟠', '🟠', '🟠', '🟡', '🟡', '🟡', '🟡', '🟡', '🟡', '🟡', '🟢', '🟢', '🟢', '🟢', '🟢', '🟢', '🟢']

			pass.forEach(i => {
				let gamemodes = [];
				let str = '';
				if (i.bw > 0) gamemodes.push(`BW: ${i.bw ?.toLocaleString()}`);
				if (i.sw > 0) gamemodes.push(`SW: ${i.sw ?.toLocaleString()}`)
				if (i.tb > 0) gamemodes.push(`TB: ${i.tb ?.toLocaleString()}`)
				if (i.cq > 0) gamemodes.push(`CQ: ${i.cq ?.toLocaleString()}`)
				if (gamemodes.length) str = `(${gamemodes.join(', ')})`;
				resPass.push(`🔵 ${i.name} - **${i.value?.toLocaleString()}** ${args[int.options._subcommand == 'now' ? 0 : 3] == 'true' ? str : ''}`)
			})
			fail.forEach(i => {
				let gamemodes = [];
				let str = '';
				if (i.bw > 0) gamemodes.push(`BW: ${i.bw ?.toLocaleString()}`);
				if (i.sw > 0) gamemodes.push(`SW: ${i.sw ?.toLocaleString()}`)
				if (i.tb > 0) gamemodes.push(`TB: ${i.tb ?.toLocaleString()}`)
				if (i.cq > 0) gamemodes.push(`CQ: ${i.cq ?.toLocaleString()}`)
				if (gamemodes.length) str = `(${gamemodes.join(', ')})`;
				resFail.push(`${circle[i.value] ?? '⚫'} ${i.name} - **${i.value?.toLocaleString()}** ${args[int.options._subcommand == 'now' ? 0 : 3] == 'true' ? str : ''}`)
			})
			noData.forEach(i => {
				resNoData.push(`⚫ ${i.name} - **${i.value}**`)
			})

			if (!resPass.length) resPass.push('N/A');
			if (!resFail.length) resFail.push('N/A');
			if (!resNoData.length) resNoData.push('N/A');

			let embed = new Discord.MessageEmbed()
				.setAuthor("Cosmic guild Checklist", int.guild.iconURL({ dynamic: true, size: 1024 }))
				.setDescription(`Wins from BW, SW, TB, and CQ`)
				.setColor('YELLOW')
				.setFooter(`Members Passed: ${resPass[0] == 'N/A' ? '0' : resPass.length}/${guildRes.memberCount}`)
				.setTimestamp(int.options._subcommand == 'get' ? sTime2.getTime() : new Date().getTime())
				.setTitle(int.options._subcommand == 'get' ? `Wins from ${lastData.localeDate}` : `Wins Gained since ${lastData.localeDate}`)
				.setThumbnail(int.guild.iconURL({ dynamic: true, size: 1024 }))
				.addField(
					`Summary`,
					`**Wins:** ${totWins.toLocaleString()}\n` +
					`➜ Bedwars: ${bwWins ?.toLocaleString()}\n` +
					`➜ SkyWars: ${swWins ?.toLocaleString()}\n` +
					`➜ The Bridge: ${tbWins ?.toLocaleString()}\n` +
					`➜ Conquests: ${cqWins ?.toLocaleString()}\n` +
					`**Guild XP:** ${(totWins * 10).toLocaleString()}\n` +
					`**Abs Guild XP:** ${(guildRes.xp - lastData.xp).toLocaleString()}`
				)

			let embed2 = new Discord.MessageEmbed()
				.setAuthor("Cosmic guild Checklist", int.guild.iconURL({ dynamic: true, size: 1024 }))
				.setColor('AQUA')
				.setTitle(`Passed [${resPass[0] == 'N/A' ? '0' : resPass.length}]`)
				.setDescription(resPass.join('\n'))
				.setTimestamp(int.options._subcommand == 'get' ? sTime2.getTime() : new Date().getTime())

			let embed3 = new Discord.MessageEmbed()
				.setAuthor("Cosmic guild Checklist", int.guild.iconURL({ dynamic: true, size: 1024 }))
				.setColor('ORANGE')
				.setTitle(`${int.options._subcommand == 'now' ? 'Pending' : 'Failed'} [${resFail[0] == 'N/A' ? '0' : resFail.length}]`)
				.setDescription(resFail.join('\n'))
				.setTimestamp(int.options._subcommand == 'get' ? sTime2.getTime() : new Date().getTime())

			let embed4 = new Discord.MessageEmbed()
				.setAuthor("Cosmic guild Checklist", int.guild.iconURL({ dynamic: true, size: 1024 }))
				.setColor('GREY')
				.setTitle(`No Data [${resNoData[0] == 'N/A' ? '0' : resNoData.length}]`)
				.setDescription(resNoData.join('\n'))
				.setTimestamp(int.options._subcommand == 'get' ? sTime2.getTime() : new Date().getTime())

			let embeds = [embed]
			if (pass.length) embeds.push(embed2)
			if (fail.length) embeds.push(embed3)
			if (noData.length) embeds.push(embed4)

			return int.editReply({ embeds: embeds }).catch(console.log)
		} catch (e) {
			console.log(e);
		}
	}
}