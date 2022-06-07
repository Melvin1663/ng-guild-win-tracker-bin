module.exports = {
    name: 'ping',
    description: 'Sends the Bot Latency',
    memberOnly: false,
    run: (int, Discord, client, args) => {
        int.reply(`🏓 Pong! \`${Math.abs(Date.now() - int.createdTimestamp)}ms\``).catch(console.log)
    }
}