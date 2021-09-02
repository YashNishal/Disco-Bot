// jshint esversion:8

// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const { token , guildId } = require('./config.json');
var { joinVoiceChannel } = require('@discordjs/voice');
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

var connection = null;
var msgObject;

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;
    const { commandName } = interaction;
    if (commandName === "wakeup") {
        // join voice channel
        await interaction.reply("Yo!");
        const gld = client.guilds.cache.get(guildId);
        const member = gld.members.cache.get(interaction.user.id);
        var channel = member.voice.channel;

        if (channel) {
            connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator
            });
        } else {
            await interaction.followUp('No voice channel joined!');
        }
    } else if (commandName === 'sleep') {
        // kick bot
        if (connection) {
            connection.destroy();
            await interaction.reply('Bye!');
        }
        else {
            await interaction.reply('Already asleep! zz...');
        }
        connection = null;
    } else if (commandName === 'play') {
        // play song
        const songName = interaction.options.getString('song_name');
        await interaction.reply(`Searching for: ${songName}`);
        try {
            distube.play(msgObject, songName);
        } catch (err) {
            console.error('Error catched!');
        }
    } else if (commandName === 'pause') {
        // pause song
        try {
            distube.pause(msgObject);
            await interaction.reply('Song paused');
        } catch (err) {
            await interaction.reply('Song already paused');
            console.error('Error catched!');
        }
    } else if (commandName === 'resume') {
        // resumes the paused song
        try {
            distube.resume(msgObject);
            await interaction.reply('Song resumed');
        } catch (err) {
            await interaction.reply('Song already playing');
            console.error('Error catched!');
        }
    }
});

//jugaad to use distube with slash commands
client.once('messageCreate', msg => {
    msgObject = msg;
});

// Login to Discord with your client's token
client.login(token);