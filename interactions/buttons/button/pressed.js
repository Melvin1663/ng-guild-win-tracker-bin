module.exports = async (json, client, Discord, int) => {
    await int.deferUpdate();
    return int.message.edit({
        content: `${int.user.toString()} Pressed the button!`,
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
                        .setDisabled()
                )
        ]
    })
}