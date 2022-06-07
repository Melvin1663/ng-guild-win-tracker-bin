module.exports = {
	name: 'isbald',
	description: 'Checks if someone is bald or not',
	options: [
		{
			name: 'user',
			description: 'The user you want to check',
			required: true,
			type: 'USER'
		}
	],
	memberOnly: false,
	run: (int, Discord, client, args) => {
		let percent = ~~(Math.random() * 100);
		int.reply(percent == 100 ? `OH MY GOD <@${args[0]}> IS BALD 100%!!!!!!!! <:kekw_bald:954221700671733791>` : `<@${args[0]}> is **${percent}%** Bald`).catch(console.log)
	}
}