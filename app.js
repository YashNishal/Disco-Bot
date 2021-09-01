// jshint esversion:8

// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const {token , prefix} = require('./config.json');
const DisTube = require('distube');



// Create a new client instance
var client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILD_WEBHOOKS,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING
    ]
});
const distube = new DisTube.default(client);

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

client.on('messageCreate', (msg) => {
    if(msg.author.bot || !msg.content.startsWith(prefix)) return;

    const args = msg.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();

    console.log(msg.content);
    
    if (command === 'ping') {
        msg.channel.send('Pong!');
    }
    else if (command === 'p') {
        distube.play(msg, args.join(' '));
    }
    // client.channels.cache.get(msg.channelId).send('hello');
});
// Login to Discord with your client's token
client.login(token);