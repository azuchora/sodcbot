const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { Interaction } = require('discord.js');
const ExtendedClient = require('../../structures/ExtendedClient');
const { getAnalyzedBedTimeSessions, mergeSessionsByDay, getBedTimeSessions } = require('../../tools/sleep');
const { getPlayerSessions } = require('../../tools/players');
const { getSleepEmbed } = require('../../components/discordEmbeds');
const { getBattlemetricsPlayerInfo } = require('../../tools/battleMetricsAPI');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('sleep')
    .setDescription('check someones sleeping habits ;)')
    .addStringOption(option =>
        option
        .setName('playerid')
        .setDescription('BattlemetricsId')
        .setRequired(true)
        )
        .setDMPermission(false),
        // .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {Interaction} interaction 
     */ 
    async execute(client, interaction){
        await interaction.deferReply({ ephemeral: true });
        const playerId = interaction.options.getString('playerid');
        const playerInfo = await getBattlemetricsPlayerInfo(client, playerId);
        if(!playerInfo){
            await interaction.followUp({ content: 'Invalid playerid', ephemeral: true });
            return;
        }
        let sessions = await getPlayerSessions(playerId);
        sessions = mergeSessionsByDay(sessions);
        const sleepInfo = getAnalyzedBedTimeSessions(sessions);
        const data = {
            name: playerInfo.name,
            playerId,
            ...sleepInfo,
        };
        const hasUndefined = (obj) => {
            if(obj?.averageBedTime) return false;
            if(obj?.averageWakeUpTime) return false;
            return true; 
        };
        if(hasUndefined(sleepInfo)){
            await interaction.followUp({ content: 'Not enough data', ephemeral: true });
            return;
        }
        const embed = getSleepEmbed(data);
        await interaction.followUp({ embeds: [embed], ephemeral: true });
    }
};
