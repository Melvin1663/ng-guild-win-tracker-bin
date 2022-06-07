module.exports = {
  name: 'hi',
  description: 'Says hi back',
  memberOnly: false,
  run: async (int, Discord, client, args) => {
    try {
      let arr = ['Well hello there', 'Hi', 'Greetings', 'Lol hi', 'Hewwo', 'Heyo', 'Hi xd', 'Hallo', 'NiHao', 'Sup']
      int.reply(`${arr[Math.floor(Math.random() * arr.length)]} ${int.user.toString()}`).catch(console.log)
    } catch (e) {
      console.log(e)
    }
  }
}