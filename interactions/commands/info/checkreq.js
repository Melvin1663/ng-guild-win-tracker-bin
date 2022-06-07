const dataSchema = require('../../../schemas/data_weeks');
const tiny = require('tiny-json-http');
const get = require('node-fetch2');

module.exports = {
  name: 'checkreq',
  description: 'Checks if there is anyone who didnt get 30 wins on the last 2 weeks',
  memberOnly: true,
  run: async (int, Discord, client, args) => {
    try {
      if (!int.deffered && !int.replied) await int.deferReply().catch(console.log)
      let month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      let lastData;
      let lastData2;
      let t = new Date();
      let t2;
      let sundays = require('../../../functions/getSundays')(month.indexOf(args[0] == 'Now' ? month[new Date().getMonth()] : args[0]), args[2] == 'Now' ? new Date().getFullYear() : args[2]);
      let sTime1 = new Date(`${args[0] == 'Now' ? month[new Date().getMonth()] : args[0]} ${(args[0] == 'Now' ? month[new Date().getMonth()] : args[0]) == 'Jan' ? sundays[args[1] - 1] - 2 : sundays[args[1] - 1]}, ${args[2] == 'Now' ? new Date().getFullYear() : args[2]}`).getTime();
      let sTime2 = new Date(sTime1 - 604800000);
      t.setDate(t.getDate() - t.getDay());
      lastData = await dataSchema.findOne({ localeDate: `${month[t.getMonth()]} ${t.getDate()}, ${t.getFullYear()}` });
      t2 = new Date(t.getTime() - 604800000)
      lastData2 = await dataSchema.findOne({ localeDate: `${month[t2.getMonth()]} ${t2.getDate()}, ${t2.getFullYear()}` });

      if (!lastData) return int.editReply('Data 1 not found').catch(console.log)
      if (!lastData2) return int.editReply('Data 2 not found').catch(console.log)

      let noreq1 = [];
      let noreq2 = [];

      for (let i in lastData.data) {
        if (lastData.data[i].wins < 30) noreq1.push(i);
      }

      for (let i in lastData2.data) {
        if (lastData2.data[i].wins < 30) noreq2.push(i);
      }

      let noreq = require('../../../functions/arrDups')(noreq1.concat(noreq2))

      if (!noreq.length) return int.editReply("Wow no one failed!").catch(console.log)

      // let son = await tiny.post({
      //   url: "https://api.ngmc.co/v1/players/batch",
      //   body: { names: noreq },
      //   headers: { "Authorization": client.ngKey }
      // });

      let guildRes = await get('https://api.ngmc.co/v1/guilds/cosmic?expand=true&withStats=true', { headers: { "Authorization": client.ngKey } }).catch(e => console.log(e))
      if (!guildRes) return int.editReply("Couldn't find Cosmic guild").catch(console.log)
      if (guildRes.status != 200) return int.editReply(`Error when fetching guild: ${guildRes.statusText}`).catch(console.log)
      guildRes = await guildRes.json();
      let playerList = guildRes.members.concat(guildRes.officers).concat([guildRes.leader]);

      noreq.forEach((p, i) => {
        let v = playerList?.find(o => o.name == p);
				console.log(v)
        // if (v.length) v = v[0]
        if (!v) noreq[i] = `⚫ ${p}`;
        else if (((v.extra.bwWins+v.extra.swWins+v.extra.tbWins+v.extra.cqWins) - (lastData.data[p].bw.totalWins+lastData.data[p].sw.totalWins+lastData.data[p].tb.totalWins+lastData.data[p].cq.totalWins)) < 30)  noreq[i] = `🔴 ${p}`;
        else if (((v.extra.bwWins+v.extra.swWins+v.extra.tbWins+v.extra.cqWins) - (lastData.data[p].bw.totalWins+lastData.data[p].sw.totalWins+lastData.data[p].tb.totalWins+lastData.data[p].cq.totalWins)) > 29) noreq[i] = `🟢 ${p}`;
				else noreq[i] = `⚫ ${p}`
      })

      let embed = new Discord.MessageEmbed()
        .setAuthor('Cosmic Inc.', int.guild.iconURL({ dynamic: true, size: 1024 }))
        .setTitle(`${noreq.length} Players found`)
        .setDescription(`🟢 = Passed win req this week\n🔴 = Didn't pass win req 3 weeks\n⚫ = No Data\n\n` + noreq.join('\n'))
        .setColor('FF55FF')
        .setTimestamp()
        .setFooter(`< 30 wins from ${t2.toLocaleDateString()} - ${t.toLocaleDateString()}`)

      int.editReply({ embeds: [embed] }).catch(console.log)
    } catch (e) {
      console.log(e)
    }
  }
}