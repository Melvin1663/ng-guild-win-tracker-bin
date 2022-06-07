const ytpl = require("ytpl");
const yts = require('youtube-search');
const ytdl = require("ytdl-core");
const moment = require('moment');
const hhmmss = require('hhmmss');
const hhmmssToSec = require('hhmmsstosec');
const Discord = require('discord.js')

module.exports = async (query, client, int) => {
    const url = query ? query.replace(/<(.+)>/g, "$1") : "";
    if (!url) return { code: 1, txt: 'No Query given' };

    if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
        return { code: 2, txt: 'Ability to play youtube playlists is coming sooooooon' };
        // try {
        //     const playlist = await ytpl(url.split("list=")[1]);
        //     if (!playlist) return Error("Playlist not found", message);
        //     const videos = await playlist.items;
        //     message.channel.send({
        //         embeds: [
        //             new Discord.MessageEmbed()
        //                 .setAuthor("Playlist Added to queue", MusicGif)
        //                 .setThumbnail(playlist.bestThumbnail.url)
        //                 .addFields(
        //                     { name: "Playlist", value: `[${playlist.title}](${playlist.url})`, inline: true },
        //                     { name: "Queued", value: `${playlist.estimatedItemCount} Songs`, inline: true },
        //                     { name: "Channel", value: `[${playlist.author.name}](${playlist.author.url})`, inline: true },
        //                     { name: "Requested by", value: message.author.username, inline: true },
        //                     { name: "Visibility", value: playlist.visibility, inline: true }
        //                 )
        //                 .setFooter(`Views: ${parseInt(playlist.views).toLocaleString()} | ${playlist.lastUpdated}`)
        //                 .setColor("GREEN")
        //         ]
        //     });
        //     for (const video of videos) {
        //         // eslint-disable-line no-await-in-loop
        //         await handleVideo(video, message, channel, true); // eslint-disable-line no-await-in-loop
        //     }
        // } catch (error) {
        //     console.error(error);
        //     return Error("Playlist not found :(", message).catch(console.error);
        // }
    } else if (url.match(/^https?:\/\/open.spotify.com\/playlist(.*)$/)) {
        return { code: 2, txt: 'Ability to play spotify playlists is coming sooooooon' };
    } else if (url.match(/^https?:\/\/open.spotify.com\/track(.*)$/)) {
        return { code: 2, txt: 'Ability to play spotify tracks is coming soooooon' };
    } else if (url.match(/^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi)) {
        let songInfo = await ytdl.getInfo(url, { key: process.env.YT_KEY });
        if (!songInfo) return { code: 1, txt: 'Video unavailable' };

        let song = {
            id: songInfo.videoDetails.videoId,
            title: Discord.Util.escapeMarkdown(songInfo.videoDetails.title),
            description: songInfo.videoDetails.description,
            url: songInfo.videoDetails.video_url,
            img: songInfo.videoDetails.thumbnails[songInfo.videoDetails.thumbnails.length - 1].url,
            duration: songInfo.videoDetails.isLiveContent == false ? hhmmss(songInfo.videoDetails.lengthSeconds) : 'LIVE',
            ago: moment(songInfo.videoDetails.publishDate, 'YYYY-MM-DD').fromNow(),
            views: parseInt(songInfo.videoDetails.viewCount).toLocaleString(),
            req: int.user,
            start: 0,
            live: songInfo.videoDetails.isLiveContent,
            startedAt: 0,
            channel: Discord.Util.escapeMarkdown(songInfo.videoDetails.ownerChannelName),
            channelLink: Discord.Util.escapeMarkdown(songInfo.videoDetails.ownerProfileUrl),
            likes: parseInt(!songInfo.videoDetails.likes ? 0 : songInfo.videoDetails.likes).toLocaleString(),
            dislikes: parseInt(!songInfo.videoDetails.dislikes ? 0 : songInfo.videoDetails.dislikes).toLocaleString(),
            category: songInfo.videoDetails.category,
            ageRestricted: songInfo.videoDetails.age_restricted,
        };
        if (!song.live && hhmmssToSec(song.duration) > 10800) return { code: 3, txt: 'Song must be under 3 hours in length' };
        return { code: 0, txt: 'Success', res: song };
    } else {
        let vids = await yts(query, { key: process.env.YT_KEY, maxResults: 1, type: 'video' });
        if (!vids.results?.length) return { code: 1, txt: 'No Results' };

        let songInfo = await ytdl.getInfo(vids.results[0]?.link);
        if (!songInfo) return { code: 1, txt: 'Video unavailable' };

        let song = {
            id: songInfo.videoDetails.videoId,
            title: Discord.Util.escapeMarkdown(songInfo.videoDetails.title),
            url: songInfo.videoDetails.video_url,
            img: songInfo.videoDetails.thumbnails[songInfo.videoDetails.thumbnails.length - 1].url,
            duration: songInfo.videoDetails.isLiveContent == false ? hhmmss(songInfo.videoDetails.lengthSeconds) : 'LIVE',
            ago: moment(songInfo.videoDetails.publishDate, 'YYYY-MM-DD').fromNow(),
            views: parseInt(songInfo.videoDetails.viewCount).toLocaleString(),
            req: int.user,
            start: 0,
            live: songInfo.videoDetails.isLiveContent,
            startedAt: 0,
            channel: Discord.Util.escapeMarkdown(songInfo.videoDetails.ownerChannelName),
            channelLink: Discord.Util.escapeMarkdown(songInfo.videoDetails.ownerProfileUrl),
            likes: parseInt(!songInfo.videoDetails.likes ? 0 : songInfo.videoDetails.likes).toLocaleString(),
            dislikes: parseInt(!songInfo.videoDetails.dislikes ? 0 : songInfo.videoDetails.dislikes).toLocaleString(),
            category: songInfo.videoDetails.category,
            ageRestricted: songInfo.videoDetails.age_restricted,
        };
        if (!song.live && hhmmssToSec(song.duration) > 10800) return { code: 3, txt: 'Song must be under 3 hours in length' };
        return { code: 0, txt: 'Success', res: song };
    }//return { code: 1, txt: 'No results' }
}