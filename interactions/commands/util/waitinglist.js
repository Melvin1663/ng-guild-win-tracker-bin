const configSchema = require('../../../schemas/config');

module.exports = {
	name: 'waitinglist',
	description: 'Waiting List.',
	options: [
		{
			name: 'add',
			description: 'Add someone to the waiting list',
			type: 'SUB_COMMAND',
			options: [
				{
					name: 'player',
					description: 'The In-game name of the player you want to add',
					type: 'STRING',
					required: true
				},
				{
					name: 'discord',
					description: "What's their Discord#tag?",
					type: 'STRING',
					required: true
				},
				{
					name: 'queue',
					description: 'The queue you want this player to be in',
					type: 'STRING',
					required: true,
					choices: [
						{ name: '👑 Priority', value: '0' },
						{ name: '🌐 Normal', value: '1' },
						{ name: '🚪 On Leave', value: '2' }
					]
				},
				{
					name: 'platform',
					description: 'Where does this player play?',
					type: 'STRING',
					required: true,
					choices: [
						{ name: '💻 Desktop', value: '0' },
						{ name: '📱 Mobile', value: '1' },
						{ name: '🎮 Console', value: '2' },
						{ name: '❓ Other', value: '3' }
					]
				}
			]
		},
		{
			name: 'remove',
			description: 'Remove someone from the waiting list',
			type: 'SUB_COMMAND',
			options: [
				{
					name: 'player',
					description: 'The In-game name of the player you want to remove',
					type: 'STRING',
					required: true
				}
			]
		},
		{
			name: 'edit',
			description: 'Edit the waiting list',
			type: 'SUB_COMMAND',
			options: [
				{
					name: 'player',
					description: 'The In-game name of the player you want to edit',
					type: 'STRING',
					required: true,
				},
				{
					name: 'discord',
					description: "What's their new Discord#tag?",
					type: 'STRING',
					required: true
				},
				{
					name: 'queue',
					description: 'The new queue you want this player to be in',
					type: 'STRING',
					required: true,
					choices: [
						{ name: '👑 Priority', value: '0' },
						{ name: '🌐 Normal', value: '1' },
						{ name: '🚪 On Leave', value: '2' }
					]
				},
				{
					name: 'platform',
					description: 'Where does this player play now?',
					type: 'STRING',
					required: true,
					choices: [
						{ name: '💻 Desktop', value: '0' },
						{ name: '📱 Mobile', value: '1' },
						{ name: '🎮 Console', value: '2' },
						{ name: '❓ Other', value: '3' }
					]
				}
			]
		},
		{
			name: 'reset',
			description: 'Removes all players from the waiting list',
			type: 'SUB_COMMAND'
		},
		{
			name: 'set',
			description: 'Locate the waiting list channel',
			type: 'SUB_COMMAND',
			options: [
				{
					name: 'channel',
					description: 'The Waiting list channel',
					type: 'CHANNEL',
					required: true
				}
			]
		},
		{
			name: 'update',
			description: 'Force Update the Waiting List embed',
			type: 'SUB_COMMAND',
		}
	],
	memberOnly: true,
	run: async (int, Discord, client, args) => {
		try {
			let hasAccess = 0
			if (int.member.permissions.has('MANAGE_GUILD')) hasAccess++;
			if (int.member._roles.includes('835437290838556682')) hasAccess++;
			if (int.member._roles.includes('875201235291078696')) hasAccess++;
			if (hasAccess == 0) return int.reply({ content: "Looks like you don't have the correct permissions to use this command, sad.", ephemeral: true });
			if (!int.deffered && !int.replied) await int.deferReply().catch(console.log)
			let msg = await int.user.send("Please state the Password to continue using this command")
			await int.editReply({ content: msg.url });
			let collector = msg.channel.createMessageCollector({ filter: m => m.author.id == int.user.id, max: 1, time: 30000 });
			let configData = await configSchema.findOne({ guild: 'cosmic' });
			if (!configData) return int.editReply("Something went wrong when fetching config data... Try again later").catch(console.log)

			collector.on('collect', async m => {
				if (m.content == configData.password) {
					if (int.options._subcommand == 'set') {
						await configData.updateOne({ waitingListChannel: args[0] });
						return int.editReply(`The waiting list channel has been set to <#${args[0]}>`).catch(console.log)
					}
					if (configData.waitingListChannel == 'N/A') return int.editReply("Couldn't find the waiting list channel, do `/waitinglist set` to locate the channel").catch(console.log)
					let wlChannel = await int.guild.channels.fetch(configData.waitingListChannel);
					if (!wlChannel) return int.editReply("Couldn't find the waiting list channel, do `/waitinglist set` to locate the channel").catch(console.log)
					let wlMsg;
					if (configData.waitingListMsg == 'N/A') {
						let newWlMsg = await wlChannel.send({ content: 'Loading...' }).catch(console.log)
						await require('../../../functions/updateWLEmbed')(Discord, client, int, newWlMsg)
						await configData.updateOne({ waitingListMsg: newWlMsg.id })
						wlMsg = newWlMsg;
					} else wlMsg = await wlChannel.messages.fetch(configData.waitingListMsg)
					m.react('✅')
					switch (int.options._subcommand) {
						case 'add': {
							if (configData.waitingList.filter(obj => obj.name == args[0]).length > 0) return int.editReply(`Player \`${args[0]}\` is already in the waiting list!`)
							await configData.updateOne({
								$push: {
									waitingList: { name: args[0], discord: args[1], queue: args[2], platform: args[3] }
								}
							}, { upsert: true })
							int.editReply(`Player \`${args[0]}\` has been added to the waiting list`).catch(console.log)
							await require('../../../functions/updateWLEmbed')(Discord, client, int, wlMsg);
						}; break;
						case 'remove': {
							let dat = configData.waitingList.filter(obj => obj.name == args[0])
							if (!dat.length) return int.editReply(`Cannot find player \`${args[0]}\` in the waiting list`).catch(console.log)
							await configData.updateOne({
								$pull: {
									waitingList: dat[0]
								}
							}, { multi: true }).catch(e => console.log(e))
							int.editReply(`Player \`${args[0]}\` has been removed from the waiting list`).catch(console.log)
							await require('../../../functions/updateWLEmbed')(Discord, client, int, wlMsg);
						}; break;
						case 'edit': {
							let dat = configData.waitingList.filter(obj => obj.name == args[0])
							if (!dat.length) return int.editReply(`Cannot find player \`${args[0]}\` in the waiting list`).catch(console.log)
							await configData.updateOne({
								$pull: {
									waitingList: dat[0]
								},
							}, { multi: true }).catch(e => console.log(e))
							await configData.updateOne({
								$push: {
									waitingList: { name: args[0], discord: args[1], queue: args[2], platform: args[3] }
								}
							}, { upsert: true }).catch(e => console.log(e))
							int.editReply(`Player \`${args[0]}\` has been edited`).catch(console.log)
							await require('../../../functions/updateWLEmbed')(Discord, client, int, wlMsg);
						}; break;
						case 'reset': {
							await int.editReply({
								content: "Are you REALLY sure you want to reset the waiting list? (This will remove everyone from the waiting list)",
								components: [
									new Discord.MessageActionRow()
										.addComponents(
											new Discord.MessageButton()
												.setCustomId(JSON.stringify({
													cmd: 'waitinglist',
													do: 'resetNo',
													data: `${int.user.id}`
												}))
												.setLabel("No, I want to keep it")
												.setStyle('SUCCESS'),
											new Discord.MessageButton()
												.setCustomId(JSON.stringify({
													cmd: 'waitinglist',
													do: 'resetYes',
													data: `${int.user.id}`
												}))
												.setLabel("Yes, Annihilate everyone from the Waiting list!")
												.setStyle('DANGER')
										)
								]
							}).catch(console.log)
						}; break;
						case 'update': {
							await require('../../../functions/updateWLEmbed')(Discord, client, int, wlMsg);
							int.editReply(`Updated the embed`).catch(console.log)
						}; break;
					}
				} else m.reply('Incorrect password xd').catch(console.log)
			})
		} catch (e) {
			console.log(e)
		}
	}
}