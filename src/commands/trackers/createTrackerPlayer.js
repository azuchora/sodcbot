const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { Interaction } = require('discord.js');
const ExtendedClient = require('../../structures/ExtendedClient');
const { getPlayerTrackerEmbed } = require('../../components/discordEmbeds');
const { getPlayerTrackerButtons } = require('../../components/discordButtons');
const { updatePlayer } = require('../../database/queries/players');
const GuildTools = require('../../tools/guilds');
const { getBattlemetricsPlayerInfo } = require('../../tools/battleMetricsAPI');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createplayer')
        .setDescription('Create new player tracker')
        .addStringOption(option =>
            option
                .setName('playerid')
                .setDescription('BattlemetricsID')
                .setRequired(true))
        .setDefaultPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ADMINISTRATOR),
    async execute(client, interaction) {
        const playerId = interaction.options.getString('playerid');
        const guild = await client.guilds.fetch(interaction.guild.id);
        const channel = interaction.channel;

        const playerData = await getBattlemetricsPlayerInfo(client, playerId);

        if (!playerData) {
            await interaction.reply({ content: 'Failed to find player.', ephemeral: true });
            return;
        }

        const newChannel = await guild.channels.create({
            name: playerId,
            type: ChannelType.GuildText,
            parent: channel.parentId
        });

        const tracker = {
            name: 'Player tracker',
            active: true,
            channelId: newChannel.id,
            channelName: newChannel.name,
            categoryId: newChannel.parentId,
            categoryName: newChannel.parent?.name || 'Unknown Category',
            messageId: null,
            threadId: null,
            everyone: true,
            onlineCount: 0,
            nameChangeHistory: [],
            players: [playerData],
        };

        const trackerEmbed = getPlayerTrackerEmbed(playerData, tracker.serverName);
        const message = await newChannel.send({ embeds: [trackerEmbed], components: getPlayerTrackerButtons(tracker) });
        tracker.messageId = message.id;

        await updatePlayer(tracker);

        await interaction.reply({ content: 'Successfully started tracking.', ephemeral: true });
    }
};
