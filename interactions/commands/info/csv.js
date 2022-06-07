const dataSchema = require('../../../schemas/data_weeks');
const playerSchema = require('../../../schemas/players');
const tiny = require('tiny-json-http');
const get = require('node-fetch2');
const fs = require('fs');
const { resolve } = require('path');

module.exports = {
	name: 'csv',
	description: 'Sends all your weekly data',
	memberOnly: true,
	options: [
		{
			name: 'player',
			description: 'The Players IGN (Case Sensitive)',
			type: 'STRING',
			required: true
		}
	],
	run: async (int, Discord, client, args) => {
		try {
			if (!int.deffered && !int.replied) await int.deferReply().catch(console.log)

			let a = 0;
			let playerIGN = args[0];
			if (!playerIGN) return int.editReply("Player not found");
			let datas = await dataSchema.find();
			if (!datas || !datas.length) return int.editReply("Data not found");
			let csv = {
				Time: [
					'Total Wins',
					'Total Kills',
					'Total Deaths',
					'Total Credits',
					'Total Losses',
					'Weekly Wins',
					'Weekly Kills',
					'Weekly Deaths',
					'Weekly GXP',
					'Weekly Credits',
					'Weekly Losses',
					'BW Total Wins',
					'BW Total Kills',
					'BW Total Deaths',
					'BW Weekly Wins',
					'BW Weekly Kills',
					'BW Weekly Deaths',
					'BW Weekly GXP',
					'SW Total Wins',
					'SW Total Kills',
					'SW Total Deaths',
					'SW Weekly Wins',
					'SW Weekly Kills',
					'SW Weekly Deaths',
					'SW Weekly GXP',
					'TB Total Wins',
					'TB Total Kills',
					'TB Total Deaths',
					'TB Weekly Wins',
					'TB Weekly Kills',
					'TB Weekly Deaths',
					'TB Weekly GXP',
					'CQ Total Wins',
					'CQ Total Kills',
					'CQ Total Deaths',
					'CQ Weekly Wins',
					'CQ Weekly Kills',
					'CQ Weekly Deaths',
					'CQ Weekly GXP',
				]
			}
			datas.forEach(data => {
				if (data.data[playerIGN]) {
					a++
					csv['"' + data.localeDate + '"'] = [];
					for (key in data.data[playerIGN]) {
						if (typeof data.data[playerIGN][key] == 'object') {
							for (k in data.data[playerIGN][key]) {
								csv['"' + data.localeDate + '"'].push(data.data[playerIGN][key][k]);
							}
						} else csv['"' + data.localeDate + '"'].push(data.data[playerIGN][key]);
					}
				}
			});

			if (a == 0) return int.editReply("Player was not found in the database, make sure you made no typos and Letter Cases are correct");
			let csvData = [];

			for (const k in csv) {
				let arr = [];
				arr.push(k);
				arr.push(...csv[k])
				csvData.push(arr);
			}

			csvData = csvData.map(v => v.join(','))

			fs.writeFileSync(resolve(__dirname, '../../../sheet.csv'), csvData.join('\n'))
			return int.editReply({
				content: `${playerIGN}'s Data (Open with a spreadsheet app)`,
				files: [{
					attachment: resolve(__dirname, '../../../sheet.csv'),
					name: `${playerIGN}.csv`,
					description: 'Player Data'
				}]
			})
		} catch (e) {
			console.log(e)
		}
	}
}