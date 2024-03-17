const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getBattlemetricsPlayerInfo } = require('../../util/battleMetricsAPI');
const playerEmbed = require('../../util/battleMetricsAPI.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('find')
        .setDescription('Sprawdź, gdzie grał twój przeciwnik.')
        .addIntegerOption(option =>
            option
                .setName('playerid')
                .setDescription('ID gracza z BattleMetrics')
                .setRequired(true)
        )
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator), async execute(client, interaction) {
            const playerId = interaction.options.getInteger('playerid');

            if (isNaN(playerId) || playerId > 9999999999 || playerId < 0) {
                await interaction.reply({ content: 'Nieprawidłowe ID gracza.', ephemeral: true });
                return;
            }

            try {
                const playerInfo = await getPlayerInfo(playerId);

                if (!playerInfo || playerInfo.length === 0) {
                    await interaction.reply({ content: 'Nie znaleziono informacji o tym graczu.', ephemeral: true });
                    return;
                }

                const embed = playerEmbed(playerInfo);
                await interaction.reply({ embed: embed, ephemeral: true });
            } catch (error) {
                console.error('Wystąpił błąd podczas pobierania informacji o graczu:', error);
                await interaction.reply({ content: 'Wystąpił błąd podczas pobierania informacji o graczu.', ephemeral: true });
            }
        }
};
