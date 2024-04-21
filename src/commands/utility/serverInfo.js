const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getBattlemetricsServerInfo } = require('../../tools/battleMetricsAPI');
const { getServerEmbed } = require('../../components/discordEmbeds');
const { Interaction } = require('discord.js');
const ExtendedClient = require('../../structures/ExtendedClient');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Basic server info')
    .addStringOption(option =>
        option
        .setName('serverid')
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
        
        const serverId = interaction.options.getString('serverid');
        
        const serverInfo = await getBattlemetricsServerInfo(client, serverId);

        if (serverInfo == null){
            await interaction.followUp({ content: 'Couldnt find server.', ephemeral: true });
            return;
        }

        await interaction.followUp({ embeds: [getServerEmbed(serverInfo)] });
    }
};
