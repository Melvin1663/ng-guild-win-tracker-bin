const configSchema = require('../schemas/config');

module.exports = async (Discord, client, int, msg) => {
    let configData = await configSchema.findOne({ guild: 'cosmic' });
    if (!configData) return int.editReply("Unable to update the embed")
    msg.edit({
        embeds: [
            new Discord.MessageEmbed()
                .setAuthor('Cosmic Inc.', int.guild.iconURL({ dynamic: true, size: 1024 }))
                .setColor('42BFF5')
                .setTitle('<a:mc_clock:891203358923321344> Cosmic Waiting List')
                .setDescription(
                    "<a:heart_pink:891211964112588851> **Priority** - This is mainly for the People who have had to go on leave or been in the Guild in the past.\n" +
                    "<a:heart_lime:891211964620111882> **Normal** - This is the Queue most people will be put in after they completed their Tryout.\n" +
                    "<a:heart_red:891211965094068224> **On Leave** - This is for the People that have had to leave for reasons such as School or other reasons.\n\n" +
                    "<:notes:891214103891288084> After you are on the Waiting List wait __Patiently__ and you'll be Invited once a space opens up.\n" +
                    "<:links:891214103966801980> **__DO NOT__** Ping Guild Owners/Officers to invite you."
                ),
            new Discord.MessageEmbed()
                .setAuthor('Cosmic Inc.', int.guild.iconURL({ dynamic: true, size: 1024 }))
                .setColor('FF55FF')
                .setTitle(`Priority [${configData.waitingList.filter(o => o.queue == '0').length}]`)
                .setDescription(`${(configData.waitingList.filter(o => o.queue == '0').map(v => `**${Discord.Util.escapeMarkdown(v.name)}** (${Discord.Util.escapeMarkdown(v.discord)}) - ${['Desktop', 'Mobile', 'Console', 'Other'][`${v.platform}`]}`).join('\n')) ?? "**__Queue is empty__**"}`)
                .setTimestamp(),
            new Discord.MessageEmbed()
                .setAuthor('Cosmic Inc.', int.guild.iconURL({ dynamic: true, size: 1024 }))
                .setColor('BFFF00')
                .setTitle(`Normal [${configData.waitingList.filter(o => o.queue == '1').length}]`)
                .setDescription(`${(configData.waitingList.filter(o => o.queue == '1').map(v => `**${Discord.Util.escapeMarkdown(v.name)}** (${Discord.Util.escapeMarkdown(v.discord)}) - ${['Desktop', 'Mobile', 'Console', 'Other'][`${v.platform}`]}`).join('\n')) ?? "**__Queue is empty__**"}`)
                .setTimestamp(),
            new Discord.MessageEmbed()
                .setAuthor('Cosmic Inc.', int.guild.iconURL({ dynamic: true, size: 1024 }))
                .setColor('FF0000')
                .setTitle(`On Leave [${configData.waitingList.filter(o => o.queue == '2').length}]`)
                .setDescription(`${(configData.waitingList.filter(o => o.queue == '2').map(v => `**${Discord.Util.escapeMarkdown(v.name)}** (${Discord.Util.escapeMarkdown(v.discord)}) - ${['Desktop', 'Mobile', 'Console', 'Other'][`${v.platform}`]}`).join('\n')) ?? "**__Queue is empty__**"}`)
                .setTimestamp()
        ]
    }).catch(e => console.log(e))
}