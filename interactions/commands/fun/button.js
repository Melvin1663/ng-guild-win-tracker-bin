module.exports = {
  name: 'button',
  description: 'Do you want to press the Big red button?',
  memberOnly: false,
  run: (int, Discord, client, args) => {
    try {
      int.reply({
        content: 'Press the red button',
        components: [
          new Discord.MessageActionRow()
            .addComponents(
              new Discord.MessageButton()
                .setCustomId(JSON.stringify({
                  cmd: 'button',
                  do: 'pressed'
                }))
                .setLabel("Red Button")
                .setStyle('DANGER')
            )
        ]
      }).catch(console.log)
    } catch (e) {
      console.log(e)
    }
  }
}