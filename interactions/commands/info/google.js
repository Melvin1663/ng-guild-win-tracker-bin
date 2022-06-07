const get = require('node-fetch2');

module.exports = {
  name: 'google',
  description: 'Google search engine BUT in discord',
  options: [
    {
      name: 'images',
      description: 'Search images through google images',
      type: 'SUB_COMMAND',
      options: [
        {
          name: 'query',
          description: 'The name of the image you want to search for',
          type: 'STRING',
          required: true
        }
      ]
    },
    {
      name: 'search',
      description: 'Google search',
      type: 'SUB_COMMAND',
      options: [
        {
          name: 'query',
          description: 'Search web pages through google search',
          type: 'STRING',
          required: true
        }
      ]
    }
  ],
  memberOnly: false,
  run: async (int, Discord, client, args) => {
    try {
      let colors = ['GREEN', 'YELLOW', 'RED', 'BLUE']
        switch (int.options._subcommand) {
            case 'search': {
                if (!int.deffered && !int.replied) await int.deferReply().catch(console.log)
                let res = await get(`https://customsearch.googleapis.com/customsearch/v1?q=${args[0]}&cx=${process.env.GOOGLE_CX}&key=${process.env.GOOGLE_KEY}`).catch(e => console.log(e))
                if (res.status != 200) return int.editReply(`Error ${res.status}: ${res.statusText}`).catch(console.log)
                res = await res.json()
                if (!res.items.length) return int.editReply(`No results found.`).catch(console.log)
                let items = res.items.slice(0, 10)
                let a = [];
                let b = [];

                items.forEach((item, i) => {
                    a.push(`[${item.title}](${item.link}) - ${item.snippet ?? '**__No Snippet__**'}`)
                    b.push({
                        label: item.title,
                        description: `${item.snippet ? item.snippet.substring(0, 96) : 'No Snippet'}...` ?? 'No content',
                        value: `${i}`,
                    })
                })

                let embed = new Discord.MessageEmbed()
                    .setAuthor('Cosmic Inc.', int.guild.iconURL({ dynamic: true, size: 1024 }))
                    .setTitle(args[0])
                    .setURL(`https://www.google.com/search?q=${encodeURIComponent(args[0])}`)
                    .setColor(colors[Math.floor(Math.random() * colors.length)])
                    .setFooter(`${items.length} of ${res.searchInformation.formattedTotalResults} Results`, 'https://i.imgur.com/wv9TNMK.png')
                    .setTimestamp()
                    .setDescription(a.join('\n\n'))
                    .setThumbnail('https://i.imgur.com/wv9TNMK.png')

                let dropdown = new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageSelectMenu()
                            .setCustomId(JSON.stringify({
                                cmd: 'google',
                                do: 'selectResults',
                                data: args[0]
                            }))
                            .setPlaceholder('Select a Result')
                            .addOptions(b),
                    );

                int.editReply({ embeds: [embed], components: [dropdown] }).catch(console.log)
            }; break;
            case 'images': {
                await int.deferReply({ ephemeral: true })
                let res = await get(`https://customsearch.googleapis.com/customsearch/v1?q=${args[0]}&cx=${process.env.GOOGLE_CX}&key=${process.env.GOOGLE_KEY}&searchType=image`).catch(e => console.log(e))
                if (res.status != 200) return int.editReply(`Error ${res.status}: ${res.statusText}`)
                res = await res.json()
                if (!res.items.length) return int.editReply(`No results found.`);

                int.editReply({
                    embeds: [
                        new Discord.MessageEmbed()
                            .setColor(colors[Math.floor(Math.random() * colors.length)])
                            .setImage(res.items[0].link)
                            .setTitle(`Image result for ${args[0]}`)
                    ]
                }).catch(console.log)
            }; break;
        }
    } catch (e) {
      console.log(e)
    }
  }
}