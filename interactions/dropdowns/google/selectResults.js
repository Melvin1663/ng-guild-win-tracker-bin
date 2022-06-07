const get = require('node-fetch2');

module.exports = async (json, client, Discord, int) => {
    await int.deferReply({ ephemeral: true });
    let colors = ['GREEN', 'YELLOW', 'RED', 'BLUE']
    let res = await get(`https://customsearch.googleapis.com/customsearch/v1?q=${json.data}&cx=${process.env.GOOGLE_CX}&key=${process.env.GOOGLE_KEY}`).catch(e => console.log(e))
    if (res.status != 200) return int.editReply(`Error ${res.status}: ${res.statusText}`)
    res = await res.json()
    if (!res.items.length) return int.editReply(`No results found.`);
    let item = res.items[int.values[0]]

    let embed = new Discord.MessageEmbed()
        .setAuthor(`Cosmic Inc.`, int.guild.iconURL({ dynamic: true, size: 1024 }))
        .setTitle(item.title)
        .setURL(item.link)
        .setColor(colors[Math.floor(Math.random() * colors.length)])
        .setDescription(item.snippet ?? '**__No Snippet__**')
        .setImage(item.pagemap?.cse_image?.[0].src || item.pagemap?.cse_thumbnail?.[0].src)
        .setThumbnail('https://i.imgur.com/wv9TNMK.png')
        .setFooter(`Result ${parseInt(int.values[0]) + 1} of ${res.searchInformation.formattedTotalResults}`, 'https://i.imgur.com/wv9TNMK.png')
        .setTimestamp()

    int.editReply({ embeds: [embed] })
}