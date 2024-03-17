const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getBattlemetricsPlayerInfo } = require('../../util/battleMetricsAPI');
const { getPlayerEmbed } = require('../../tools/discordEmbeds');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('find')
        .setDescription('Basic player info')
        .addIntegerOption(option =>
            option
                .setName('playerid')
                .setDescription('BattlemetricsId')
                .setRequired(true)
        )
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
        
    async execute(client, interaction){
        const playerId = interaction.options.getInteger('playerid');

        if (isNaN(playerId) || playerId > 9999999999 || playerId <= 0){
            await interaction.reply({ content: 'Invalid playerid.', ephemeral: true });
            return;
        }
        
        const playerInfo = await getBattlemetricsPlayerInfo(client, playerId);

        if (playerInfo == null){
            await interaction.reply({ content: 'Couldnt find player.', ephemeral: true });
            return;
        }

        const embed = getPlayerEmbed(playerInfo);
        
        await interaction.reply({ embeds: [embed] });
    }
};
