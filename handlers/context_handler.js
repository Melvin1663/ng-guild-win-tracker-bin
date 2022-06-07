const fs = require('fs');

module.exports = async (client) => {
  const categories = fs.readdirSync(`${process.cwd()}/interactions/context/`);

  for (const category of categories) {
    const commandFiles = fs.readdirSync(`${process.cwd()}/interactions/context/${category}`).filter(f => f.endsWith('.js'));

    for (const file of commandFiles) {
      const command = require(`../interactions/context/${category}/${file}`);
      client.interactions.info.contextMenu[command.name] = command;
      client.interactions.post.push({ name: command.name, type: category.toUpperCase() })
    }
  }
}