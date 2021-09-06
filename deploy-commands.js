// jshint esversion:8

const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

const commands = [
	new SlashCommandBuilder().setName('wakeup').setDescription('Bot joins the current voice channel'),
	new SlashCommandBuilder().setName('stop').setDescription('Bot leaves the joined voice channel'),
	new SlashCommandBuilder().setName('play').setDescription('Enqueues a song for playing')
        .addStringOption(option => option.setName("song_name").setDescription("Song to play").setRequired(true)),
	new SlashCommandBuilder().setName('pause').setDescription('Pauses the current song'),
	new SlashCommandBuilder().setName('resume').setDescription('Resumes the current song'),
	new SlashCommandBuilder().setName('shuffle').setDescription('Shuffle the current Playlist'),
	new SlashCommandBuilder().setName('repeat').setDescription('Repeats the current song/queue 0: disabled, 1: Repeat a song, 2: Repeat all the queue')
		.addStringOption(option => option.setName("repeat_mode").setDescription('0: disabled, 1: Repeat a song, 2: Repeat all the queue').setRequired(true)),
	new SlashCommandBuilder().setName('skip').setDescription('Skips the current song'),
]
.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);
		console.log('Successfully registered application commands.');
	} catch (error) {
		console.error(error);
	}
})();