const Discord = require('discord.js');
const mongoose = require('mongoose');
const client = new Discord.Client({ intents: 32767 });
const keepAlive = require('./server.js');
require('dotenv').config();

client.interactions = {
    post: [],
    info: {
        slashCommands: {},
        contextMenu: {}
    }
};
client.snipes = {
    sum: {}
};
client.esnipes = {
    sum: {}
}
client.ngKey = 'f your self';
client.queue = new Map();
client.cooldowns = new Map();

['event_handler', 'slash_handler', 'context_handler'].forEach(handler => {
    require(`./handlers/${handler}`)(client, Discord);
})

mongoose.connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to the Database")
}).catch((err) => {
    console.log(err);
});

keepAlive();

client.login(process.env.TOKEN).catch(console.log)