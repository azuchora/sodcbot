const { ButtonInteraction } = require('discord.js');
const ExtendedClient = require('../../structures/ExtendedClient');
const GuildTools = require('../../tools/guilds');
const { getPlayerSessions } = require('../../tools/players');
const { getAnalyzedBedTimeSessions, mergeSessionsByDay } = require('../../tools/sleep');
const { getTrackerSleepEmbed } = require('../discordEmbeds');

module.exports = {
    customId: 'trackerSleepButton',
    cooldown: 5,
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {ButtonInteraction} interaction 
     */
    execute: async (client, interaction) => {
        await interaction.deferUpdate({ ephemeral: true });
        const guild = await GuildTools.getGuild(interaction.guild.id);
        const tracker = guild.trackers.find((t) => t.messageId === interaction.message.id);
        if(!tracker){
            await interaction.message.delete();
            return;
        }

        const embedData = [];
        let sleepInfo;
        let sessions;

        for(const player of tracker.players){
            sessions = await getPlayerSessions(player.bmid);
            sessions = mergeSessionsByDay(sessions);
            
            // console.log(sessions.map((s) => {
            //     return {
            //         start: new Date(s.start),
            //         stop: new Date(s.stop),
            //         id: s.id,
            //         serverId: s.serverId,
            //     };
            // }));
            if(!tracker.isSingle){
                sessions = sessions.filter((s) => s.serverId.includes(tracker.serverId));
            }
            sleepInfo = await getAnalyzedBedTimeSessions(sessions);
            embedData.push({
                name: player.name,
                bmid: player.bmid,
                steamid: player.steamid,
                ...sleepInfo,
            });
        }
        const embed = getTrackerSleepEmbed(embedData);
        await interaction.followUp({ embeds: [embed], ephemeral: true });
    }
};
