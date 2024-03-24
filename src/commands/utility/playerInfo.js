const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getBattlemetricsPlayerInfo } = require('../../tools/battleMetricsAPI');
const { getPlayerEmbed } = require('../../components/discordEmbeds');
const { Interaction } = require('discord.js');
const ExtendedClient = require('../../structures/ExtendedClient');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('playerinfo')
    .setDescription('Basic player info')
    .addIntegerOption(option =>
        option
        .setName('playerid')
        .setDescription('BattlemetricsId')
        .setRequired(true)
        )
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {Interaction} interaction 
     */ 
    async execute(client, interaction){
        await interaction.deferReply();
        
        const playerId = interaction.options.getInteger('playerid');
        
        if (isNaN(playerId) || playerId > 9999999999 || playerId <= 0){
            await interaction.followUp({ content: 'Invalid playerid.', ephemeral: true });
            return;
        }
        
        const playerInfo = await getBattlemetricsPlayerInfo(client, playerId);

        if (playerInfo == null){
            await interaction.followUp({ content: 'Couldnt find player.', ephemeral: true });
            return;
        }

        const embed = getPlayerEmbed(playerInfo);
        
        await interaction.followUp({ embeds: [embed] });
    }
};
