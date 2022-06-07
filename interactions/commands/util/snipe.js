module.exports = {
  name: 'snipe',
  description: 'Snipe the last message deleted',
  memberOnly: false,
  options: [
    {
      name: 'type',
      description: 'Which messages to snipe',
      type: 'STRING',
      required: true,
      choices: [
        { name: 'Deleted Message', value: '0' },
        { name: 'Edited Message', value: '1' }
      ]
    },
    {
      name: 'user',
      description: 'Who deleted a message?',
      type: 'USER',
      required: false
    },
    {
      name: 'channel',
      description: 'Where oh where did they delete the message?',
      type: 'CHANNEL',
      required: false
    }
  ],
  run: async (int, Discord, client, args) => {
    let data;
    switch (args[0]) {
      case "0": data = client.snipes; break;
      case "1": data = client.esnipes; break;
    }
    let sniped;
    if (!args.length) {
      let temp = data.sum[int.channel.id];
      sniped = temp ?.msg;
      args[1] = temp ?.author;
    }
    sniped = data[args[2] ?? int.channel.id] ?.[args[1] ?? int.user.id];
    if (!sniped) return int.reply('No snipes found!');

    if (!int.deffered && !int.replied) await int.deferReply().catch(console.log)

    let user = await int.guild.members.fetch(args[1] ?? int.user.id);

    int.editReply({
      embeds: [
        new Discord.MessageEmbed()
          .setAuthor(user ? `${user.user.username}#${user.user.discriminator}` : 'Unknown#0000', user ? `https://cdn.discordapp.com/avatars/${user.user.id}/${user.user.avatar}.png?size=80` : 'https://i.imgur.com/f2Mz5us.png')
          .setDescription(sniped)
          .setColor('RANDOM')
      ]
    }).catch(console.log)
  }
}