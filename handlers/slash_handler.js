const fs = require('fs');

module.exports = async (client) => {
  const categories = fs.readdirSync(`./interactions/commands/`);

  for (const category of categories) {
    const commandFiles = fs.readdirSync(`./interactions/commands/${category}`).filter(f => f.endsWith('.js'));

    for (const file of commandFiles) {
      const command = require(`../interactions/commands/${category}/${file}`);
      client.interactions.info.slashCommands[command.name] = command;
      client.interactions.post.push({
        name: command.name,
        description: command.description,
        options: command.options,
        type: 'CHAT_INPUT'
      })
    }
  }
}