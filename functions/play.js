const voice = require('@discordjs/voice');
const ytdl = require('ytdl-core');

module.exports = async (int, client, Discord) => {
    var q = client.queue.get(int.guild.id);

    const player = voice.createAudioPlayer({
        behaviors: {
            noSubscriber: voice.NoSubscriberBehavior.Pause,
        },
    });

    player.on('idle', async () => {
        let a = 0
        if (!q.songs.length) {
            q.player.removeAllListeners()
            q.player.stop();
            client.queue.delete(int.guild.id);
            return a++;
        }
        if (q.repeat == true) { a++ };
        if (q.loop == true) {
            let a = q.songs.shift();
            q.songs.push(a);
            a++
        };

        if (a == 0) q.songs.shift();

        if (!q.songs.length) {
            q.player.removeAllListeners()
            q.player.stop();
            client.queue.delete(int.guild.id);
            return a++;
        }

        await player.play(voice.createAudioResource(await ytdl(q.songs[0].url, { quality: "highestaudio", highWaterMark: 1 << 25, type: "opus", filter: 'audioonly' }), { inlineVolume: true }))
        q.connection.state.subscription.player.state.resource.volume.setVolume(q.volume)
    })

    let e = 0

    player.on('error', err => {
        console.error(err)
        e++
        q.textChannel.send('An error occured while playing the song')
        if (q.songs.length > 1) q.songs.shift();
        require('./play')(int, client, Discord)
    })

    if (e == 1) return;

    q.player = player;
    player.play(voice.createAudioResource(await ytdl(q.songs[0].url, { quality: "highestaudio", highWaterMark: 1 << 25, type: "opus", filter: 'audioonly' }), { inlineVolume: true }))
    q.connection.subscribe(player);
    q.connection.state.subscription.player.state.resource.volume.setVolume(q.volume)

    q.connection.on('disconnected', () => {
        q.connection.destroy();
        player.removeAllListeners();
        player.stop();
        client.queue.delete(int.guild.id)
    })

    let song = q.songs[0];

    player.on('playing', (oS, nS) => {
        if (q.first == true || q.notify == true) {
            if (q.first == true) q.first = false;
            let thing = new Discord.MessageEmbed()
                .setAuthor("Now Playing", 'https://i.imgur.com/5I8C0jo.gif')
                .setThumbnail(song.img)
                .setTitle(song.title)
                .setURL(song.url)
                .setColor("FF55FF")
                .addFields(
                    { name: 'Channel', value: `[${song.channel}](${song.channelLink})`, inline: true },
                    { name: 'Duration', value: song.duration, inline: true },
                    { name: 'Requested by', value: song.req.toString(), inline: true },
                    { name: 'Category', value: song.category, inline: true },
                    { name: 'Likes/Dislikes', value: `<:like:893079039223418900> ${song.likes}\n<:dislike:893079039043047444> ${song.dislikes}`, inline: true },
                    { name: 'Age Restricted', value: song.ageRestricted ? 'Yes' : 'No', inline: true }
                )
                .setFooter(`Views: ${song.views} | ${song.ago}`);

            return int.editReply({ embeds: [thing] });
        }
    })
}