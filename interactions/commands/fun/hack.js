module.exports = {
  name: 'hack',
  description: 'Hack ppl :)',
  options: [
    {
      name: 'target',
      description: 'Who are we hacking today?',
      required: true,
      type: 'USER'
    }
  ],
  memberOnly: false,
  run: async (int, Discord, client, args) => {
    if (!int.deffered && !int.replied) await int.deferReply().catch(console.log)
    const user = client.users.cache.get(args[0]);
    if (!user) return int.editReply("Oops... Access Denied").catch(console.log)
    const msg = await int.channel.send(`Hacking ${user.username}...`)
    const username = user.username.split(' ').join('')
    const emails = [
      `${username}@gmail.com`,
      `${username}NotFound@gmail.com`,
      `${username}Gaming@gmail.com`,
      `${username}Sux@gmail.com`,
      `Cool${username}@gmail.com`,
      `Epic${username}@gmail.com`,
      `${username}'sEmail@gmail.com`,
      `${username}OutLookAcc@outlook.com`
    ]
    const password = [
      `${username}rules`,
      `Starwars`,
      `${username}_is_epic`,
      `${username}LOL`,
      `${username}6969`,
      `xxx${username}xxx`,
      `${username}'s_password`,
      `Password`,
      `123456789`,
      `Poop1234`,
      `EEEEEEEEE`
    ]
    const common = [
      `lol`,
      `lel`,
      `lmao`,
      `omegalul`,
      `lolololol`,
      `ehh`,
      `no`,
      `yes`,
      `lmfao`,
      `xd`,
      `smh`,
      `smfh`,
      `ree`,
      `bruh`,
      `what`,
      `egg`,
      `smh`,
      `bro`,
      `sex`,
      `cosmetics`,
      `huh`,
      `ng`,
      `minecraft`,
      `crappygames`,
      `laggygames`,
      `bs`,
      `wtf`,
      `dude`,
      `omg`,
      `what`,
      `sleep`,
      `shit`
    ]
    const ip = [
      `77.247.110.101`,
      `119.52.217.66`,
      `113.193.45.77`,
      `119.52.217.143`,
      `91.149.244.6`,
      `48.153.109.195`,
      `77.81.142.15`,
      `103.150.187.29`,
      `147.124.213.4`,
      `45.86.201.44`,
      `203.23.128.74`,
      `198.144.120.177`,
      `34.78.148.253`,
      `83.122.227.131`,
      `69.171.251.8`,
      `69.171.251.23`,
      `31.13.115.5`,
      `31.13.115.10`,
      `31.13.115.21`,
      `69.171.251.19`,
      `31.13.127.24`,
      `31.13.127.5`,
      `31.13.127.4`,
      `173.252.127.29`,
      `31.13.115.12`,
      `31.13.127.9`,
      `51.77.169.35`,
      `37.111.134.127`
    ]
    setTimeout(() => {
      int.editReply(`🔍 Finding Email Address...`)
    }, 2000)

    setTimeout(() => {
      int.editReply(`👀 **Found**:\n**Email**: ${emails[Math.floor(Math.random()*emails.length)]}\n**Password**: ${password[Math.floor(Math.random()*password.length)]}`)
    }, 4000)

    setTimeout(() => {
      int.editReply(`🔍 Finding Most common word...`)
    }, 6000)

    setTimeout(() => {
      int.editReply(`👀 **Common Word**: ${common[Math.floor(Math.random()*common.length)]}`)
    }, 8000)

    setTimeout(() => {
      int.editReply(`⚙ Injecting trojan virus to user...`)
    }, 10000)

    setTimeout(() => {
      int.editReply(`✅ Injected trojan virus to user`)
    }, 12000)

    setTimeout(() => {
      int.editReply(`🔍 Hacking Minecraft Account...`)
    }, 14000)

    setTimeout(() => {
      int.editReply(`👀 DM'd ${int.user.username}, ${username}'s Account Details`)
      int.user.send("**Email**: ||Never gonna give you up||\n**Password**: ||Never gonna let you down||").catch(console.log)
    }, 16000)

    setTimeout(() => {
      int.editReply(`🔍 Finding ${username}'s IP Address...`)
    }, 18000)

    setTimeout(() => {
      int.editReply(`👀 **IP Address**: ${ip[Math.floor(Math.random()*ip.length)]}`)
    }, 20000)

    setTimeout(() => {
      int.editReply(`💰 Selling Data to Government...`)
    }, 22000)

    setTimeout(() => {
      int.editReply(`Finished Hacking ${user.username}`)
    }, 24000)

    setTimeout(() => {
      msg.edit("The *totally* real and Dangerous hack is complete")
    }, 26000)
  }
}