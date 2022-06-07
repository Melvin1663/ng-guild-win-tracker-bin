const playerSchema = require('../../../schemas/players');

module.exports = {
	name: 'unegg',
	description: 'Unworship eggs',
	memberOnly: true,
	run: async (int, Discord, client, args) => {
		try {
			if (!int.deffered && !int.replied) await int.deferReply().catch(console.log);
			let doc = await playerSchema.findOne({ userId: int.user.id });
			if (!doc) return int.editReply("You didn't even worship eggs");
			await doc.deleteOne({ userId: int.user.id });
			return int.editReply("You have unworshipped the eggs");
		} catch (e) {
			int.editReply("An error occured")
			console.log(e);
		}
	}
}