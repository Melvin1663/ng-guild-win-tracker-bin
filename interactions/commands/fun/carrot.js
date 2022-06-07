module.exports = {
  name: 'carrot',
  description: 'Generates carrots',
  options: [
    {
      name: 'amount',
      description: 'How many carrots should I generate?',
      required: false,
      type: 'STRING'
    },
    {
      name: 'target',
      description: 'Who are we giving this carrots to?',
      required: false,
      type: 'USER'
    }
  ],
  memberOnly: false,
  run: async (int, Discord, client, args) => {
    try {
      if ((Math.floor(Math.random() * 100)) > 80) return int.reply("The factory overloaded and couldn't bring your carrots in time")
      return int.reply(`Gave ${args[1] ? `<@${args[1]}>` : int.user.toString()} ${(args[0] ?? 1).toLocaleString()} carrot${(args[0] ?? 1) == 1 ? '' : 's'} 🥕`).catch(console.log)
    } catch (e) {
      console.log(e)
    }
  }
}