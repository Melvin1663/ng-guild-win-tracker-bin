const get = require('node-fetch2');

module.exports = async (Discord, client, int) => {
    if (!int) return;
    if (int.isCommand()) {
        let args = []
        int.options.data.map((x, i) => {
            if (x.type == 'SUB_COMMAND') int.options.data[i].options?.map(x => args.push(x.value));
            else args.push(x.value);
        })
        try {
            if (client.interactions.info.slashCommands[int.commandName]) {
                if (client.interactions.info.slashCommands[int.commandName].memberOnly == true) {
                    if (int.user.id == '731765420897599519' || int.member._roles.includes('813578075383529472') || int.member._roles.includes('812975288677826610')) return client.interactions.info.slashCommands[int.commandName].run(int, Discord, client, args)
                    return int.reply({ content: "**Only** Cosmic guild members can use my commands!", ephemeral: true });
                } else return client.interactions.info.slashCommands[int.commandName].run(int, Discord, client, args);
            } else return int.reply({ content: 'Unknown command', ephemeral: true })
        } catch (e) {
            console.log(e);
            int.reply(`Error: ${e.message}`)
        }
        return;
    }
    if (int.isContextMenu()) {
        let cmd = client.interactions.info.contextMenu[int.commandName];
        if (cmd) return cmd.run(int, Discord, client);
        int.reply({ content: 'Unknown command', ephemeral: true });
    }
    if (int.isButton()) {
        let json = JSON.parse(int.customId);
        if (!json.cmd || !json.do) return int.reply("The Interaction contained incomplete information")
        await require(`../../interactions/buttons/${json.cmd}/${json.do}`)(json, client, Discord, int).catch(e => console.log(e))
    }
    if (int.isSelectMenu()) {
        let json = JSON.parse(int.customId);
        if (!json.cmd || !json.do) return int.reply("The Interaction contained incomplete information")
        await require(`../../interactions/dropdowns/${json.cmd}/${json.do}`)(json, client, Discord, int).catch(e => console.log(e))
    }
}