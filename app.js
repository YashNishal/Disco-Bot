// jshint esversion:8

// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const { token , guildId } = require('./config.json');
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
const distube = new DisTube.default(client, {
    emptyCooldown: 30,
    ytdlOptions: {
        highWaterMark: 1024*1024*10,
        quality: 'highestaudio',
        filter: 'audioonly',
        dlChunkSize: 0,
    }
});

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

// var connection = null;
var msgObject;
var joined = false;

distube.on('searchNoResult', msg => {
    msg.channel.send('No results!');
}).on('error', (text, err) => {
    console.error('Distube error', err);
}).on('empty', (err) => {
    console.error('Empty error', err);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;
    const { commandName } = interaction;
    if (commandName === "wakeup") {

        // join voice channel
        await interaction.reply("Yo!");
        const gld = client.guilds.cache.get(guildId);
        const member = gld.members.cache.get(interaction.user.id);
        var channel = member.voice.channel;

        try {
            distube.voices.join(channel);
            joined = true;
        } catch (err) {
            await interaction.followUp('No voice channel joined!');
        }

    } else {
        if (!joined) {
            await interaction.reply('Wake me up first!');
            return;
        }
        if (commandName === 'stop') {
            // kick bot
            try {
                distube.voices.leave(msgObject);
                joined = false;
                await interaction.reply('Bye Bye!');
                
            } catch (err) {
                console.error('Error catched! - stop', err);
            }
    
        } else if (commandName === 'play') {
            // play song
            const songName = interaction.options.getString('song_name');
            await interaction.reply(`Searching for: ${songName}`);
            try {
                distube.play(msgObject, songName);
            } catch (err) {
                console.error('Error catched! : play - '+err);
            }
    
        } else if (commandName === 'pause') {
            // pause song
            try {
                distube.pause(msgObject);
                await interaction.reply('Song paused');
            } catch (err) {
                await interaction.reply('Song already paused');
                console.error('Error catched! : pause - ' + err);
            }
    
        } else if (commandName === 'resume') {
            // resumes the paused song
            try {
                distube.resume(msgObject);
                await interaction.reply('Song resumed');
            } catch (err) {
                await interaction.reply('Song already playing');
                console.error('Error catched! : resume - '+err);
            }
    
        } else if( commandName === 'skip') {
            // skips the song
            try {
                let flag = true; //becomes false if distube skip catches error
                await distube.skip(msgObject).catch(async (err) => {
                    await interaction.reply('Nothing to skip.');
                    console.error('Error catched! : skip - ' + err);
                    flag = false;
                });
                if(flag) await interaction.reply('Song skipped!');
            } catch(err) {
                console.error('Error catched! : skip - ' + err);
            }
        
        } else if (commandName === 'shuffle') {
            // gives the list of songs in the queue
            try {
                distube.shuffle(msgObject);
                await interaction.reply('Songs Shuffled!');
            } catch (err) {
                await interaction.reply('No songs playing.');
                console.error('Error catched! : shuffle - ' + err);
            }
    
        } else if (commandName === 'repeat') {
            const repeatMode = interaction.options.getString('repeat_mode');
            try {
                let mode = distube.setRepeatMode(msgObject, parseInt(repeatMode));
                mode = mode ? mode == 2 ? "Repeat queue" : "Repeat song" : "Off";
                await interaction.reply("Set repeat mode to `" + mode + "`");
            } catch (err) {
                await interaction.reply("Set repeat mode to `" + mode + "`");
                console.error('Error catched! : repeat-song - ' + err);
            }
        }
    }
});

//jugaad to use distube with slash commands
client.once('messageCreate', msg => {
    msgObject = msg;
});

// Login to Discord with your client's token
client.login(token);