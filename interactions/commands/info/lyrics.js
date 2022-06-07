const yts = require('youtube-search');
const lyrics = require('lyrics-finder');

module.exports = {
    name: 'lyrics',
    description: 'Searches for Lyrics about a song on google',
    options: [
        {
            name: 'song',
            description: 'The name of the song',
            type: 'STRING',
            required: true
        }
    ],
    run: async (int, Discord, client, args) => {
        if (!int.deffered && !int.replied) await int.deferReply().catch(console.log)

        try {
            let lyric = await lyrics(args[0]);
            let vids = await yts(args[0], { key: process.env.YT_KEY, maxResults: 1, type: 'video' });
            if (!lyric) lyric = `Unable to find the lyrics for ${args[0]}`
            if (!vids.results?.length) return int.editReply({ embeds: [new Discord.MessageEmbed({ description: lyric.length > 4090 ? lyric.substring(0, 4092) + '...' : lyric, color: 'YELLOW' })] }).catch(console.log)
            return int.editReply({
                embeds: [
                    new Discord.MessageEmbed()
                        .setAuthor('Cosmic Inc.', int.guild.iconURL({ dynamic: true, size: 1024 }))
                        .setTitle(vids.results[0].title)
                        .setThumbnail(vids.results[0].thumbnails.high.url)
                        .setURL(vids.results[0].link)
                        .setDescription(lyric.length > 4090 ? lyric.substring(0, 4092) + '...' : lyric)
                        .setColor("YELLOW")
                ]
            }).catch(console.log)
        } catch (err) {
            console.log(err);
        }
    }
}