const get = require('node-fetch2')

module.exports = async (json, client, Discord, int) => {
    if (!json.data) return int.reply('No Data provided')
    await int.deferReply();
    let p = await get(`https://apiv2.nethergames.org/v1/players/${json.data}`, { headers: { "Authorization": client.ngKey } }).catch(e => console.log(e));
    if (p?.status != 200) return int.editReply(`(Player not found) Error ${p?.status}: ${p?.statusText}`)
    p = await p.json();
    let embed = new Discord.MessageEmbed()
        .setAuthor('Cosmic Inc.', int.guild.iconURL({ dynamic: true, size: 1024 }))
        .setColor('ff55ff')
        .setTitle(`Wins summary for ${p.name}`)
				.setThumbnail(p.avatar)
        .setDescription(
            `**Bedwars:** ${p.extra.bwWins.toLocaleString()}\n` +
            `➜ **Solo:** ${p.extra.bwSoloWins.toLocaleString()}\n` +
            `➜ **Doubles:** ${p.extra.bwDoublesWins.toLocaleString()}\n` +
            `➜ **Trios:** ${p.extra.bwTriosWins.toLocaleString()}\n` +
            `➜ **Squads:** ${p.extra.bwSquadsWins.toLocaleString()}\n` +
            `**Duels:** ${p.extra.duelsWins.toLocaleString()}\n` +
            `**Murder Mystery:** ${p.extra.mmWins.toLocaleString()}\n` +
            `➜ **Classic:** ${p.extra.mmClassicWins.toLocaleString()}\n` +
            `➜ **Infection:** ${p.extra.mmInfectionWins.toLocaleString()}\n` +
            `**Momma Says:** ${p.extra.msWins.toLocaleString()}\n` +
            `**Soccer:** ${p.extra.scWins.toLocaleString()}\n` +
            `**Survival Games:** ${p.extra.sgWins.toLocaleString()}\n` +
            `**SkyWars:** ${p.extra.swWins.toLocaleString()}\n` +
            `➜ **Solo:** ${p.extra.swSoloWins.toLocaleString()}\n` +
            `➜ **Doubles:** ${p.extra.swDoublesWins.toLocaleString()}\n` +
            `**The Bridge:** ${p.extra.tbWins.toLocaleString()}\n` +
            `**TNT Run:** ${p.extra.trWins.toLocaleString()}`
        )
        .setTimestamp()

    int.message.edit({ components: [] }).catch(e => console.log(e))

    int.editReply({ embeds: [embed] })
    return;
}