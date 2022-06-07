module.exports = {
  name: 'drugs',
  description: 'Generates drugs',
  options: [
    {
      name: 'amount',
      description: 'How many drugs should I generate?',
      required: false,
      type: 'STRING'
    },
    {
      name: 'target',
      description: 'Who are we giving the drugs to?',
      required: false,
      type: 'USER'
    }
  ],
  memberOnly: false,
  run: async (int, Discord, client, args) => {
    try {
      if ((Math.floor(Math.random() * 100)) > 80) return int.reply("The government noticed suspicious activity in the factory and secretely stole all the requested drugs ***sadge***").catch(console.log)
      return int.reply(`Gave ${args[1] ? `<@${args[1]}>` : int.user.toString()} ${(args[0] ?? 1).toLocaleString()} drug${(args[0] ?? 1) == 1 ? '' : 's'} <a:HyperShake:887320329591087174>`).catch(console.log)
    } catch (e) {
      console.log(e)
    }
  }
}