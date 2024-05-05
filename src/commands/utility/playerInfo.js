const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getBattlemetricsPlayerInfo } = require('../../tools/battleMetricsAPI');
const { getPlayerEmbed } = require('../../components/discordEmbeds');
const { Interaction } = require('discord.js');
const ExtendedClient = require('../../structures/ExtendedClient');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('playerinfo')
    .setDescription('Basic player info')
    .addStringOption(option =>
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
        await interaction.deferReply({ ephemeral: true });
        
        const playerId = interaction.options.getString('playerid');
        
        const playerInfo = await getBattlemetricsPlayerInfo(client, playerId);

        if (playerInfo == null){
            await interaction.followUp({ content: 'Couldnt find player.', ephemeral: true });
            return;
        }

        const embed = getPlayerEmbed(playerInfo);
        
        await interaction.followUp({ embeds: [embed], ephemeral: true });
    }
};
