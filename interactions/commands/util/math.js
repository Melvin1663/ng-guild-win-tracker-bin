const math = require('mathjs')

module.exports = {
  name: 'math',
  description: 'Evaluates Math Equations',
  options: [
    {
      name: 'equation',
      description: "Please give me your problem and I'll answer it (if possible)",
      required: true,
      type: 'STRING'
    }
  ],
  memberOnly: false,
  run: async (int, Discord, client, args) => {
    if (!int.deffered && !int.replied) await int.deferReply().catch(console.log)

    try {
      resp = math.evaluate(args[0])
    } catch (error) {
      return int.editReply({
        embeds: [
          new Discord.MessageEmbed()
            .addField('Error:', `\`\`\`diff\n- ${error}\`\`\``)
            .setColor("#ff0000")
        ]
      });
    }

    return int.editReply({
      embeds: [
        new Discord.MessageEmbed()
          .setTitle('Calculator')
          .setColor(int.member.displayHexColor === "#000000" ? "RANDOM" : int.member.displayHexColor)
          .addField('📥 Input', `\`\`\`\n${args[0]}\`\`\``)
          .addField('📤 Output', `\`\`\`\n${resp}\`\`\``)
      ]
    }).catch(console.log)
  }
}