const { EmbedBuilder, bold } = require('discord.js');

module.exports = {
    getEmbed: function(options = {}){
        const embed = new EmbedBuilder();

        if (options.title) embed.setTitle(options.title);
        if (options.color) embed.setColor(options.color);
        if (options.description) embed.setDescription(options.description);
        if (options.thumbnail) embed.setThumbnail(options.thumbnail);
        if (options.image) embed.setImage(options.image);
        if (options.url) embed.setURL(options.url);
        if (options.author) embed.setAuthor(options.author);
        if (options.footer) embed.setFooter(options.footer);
        if (options.timestamp) embed.setTimestamp();
        if (options.fields) embed.setFields(...options.fields);
        
        return embed;
    },
    getPlayerEmbed: function(playerInfo){
        firstSeen = new Date(playerInfo.createdAt);
        nameHistory = playerInfo.nameHistory;
        previousNames = "";
        lastSeen = "";

        if(nameHistory.length){
            nameHistory.sort((a, b) => {
                const aTime = new Date(a);
                const bTime = new Date(b);
                return aTime - bTime;
            });
            recentNames = nameHistory.slice(1, 8);
            for(const name of recentNames){
                nameDate = new Date(name.lastSeen);
                previousNames += `${name.name}\n`;
                lastSeen += `<t:${Math.round(nameDate.getTime()/1000)}:f>\n`;
            }
        } else {
            previousNames = "No recent names could be found.";
        }

        return module.exports.getEmbed({
            color: 0x1198F1,
            timestamp: true,
            fields: [
                {name: 'Current name', value: `${playerInfo.name}`},
                {name: 'First seen', value: `<t:${Math.round(firstSeen.getTime()/1000)}:f>`},
                {name: 'Total playtime', value: `${Math.round(playerInfo.playTime)}h - ${Math.round(playerInfo.playTime * 2.1)}h`},
                {name: 'Name', value: previousNames ? previousNames : '-', inline: true},
                {name: 'Last seen', value: lastSeen ? lastSeen : '-', inline: true},
            ]
        });
    },
    getServerEmbed: function(server){
        const firstSeen = new Date(server.createdAt);
        const lastSeen = new Date(server.updatedAt);
        return module.exports.getEmbed({
            color: 0x1198F1,
            timestamp: true,
            fields: [
                {name: 'Name', value: server.name},
                {name: 'Address', value: server.address, inline: true},
                {name: 'Status', value: (server.status) ? ':green_circle:' : ':red_circle:', inline: true},
                {name: 'Ip', value: `${server.ip}:${server.port}`},
                {name: 'Pop', value: `${server.onlinePlayers}/${server.maxPlayers}`, inline: true},
                {name: 'Rank', value: `${server.rank}`, inline: true},
                {name: 'Country', value: server.country, inline: true},
                {name: 'First seen', value: `<t:${Math.round(firstSeen.getTime()/1000)}:f>`, inline:true},
                {name: 'Last seen', value: `<t:${Math.round(lastSeen.getTime()/1000)}:f>`, inline:true}
            ]
        });
    },
    getTrackerEmbed: function(tracker, server){
        const steamUrl = 'https://steamcommunity.com/profiles/';
        const bmUrl = 'https://www.battlemetrics.com/players/';
        playerNames = '', playerIds = '', playerStatus = '';
        for(const player of tracker.players){
            playerNames += `${player.name}\n`;
            if(tracker.players.length < 8){
                if(player.bmid) playerIds += `[BM](${bmUrl}${player.bmid}) `;
                if(player.steamid) playerIds += (player.bmid) ? `| [STEAM](${steamUrl}${player.steamid})` : `[STEAM](${steamUrl}${player.steamid})`;
                playerIds += '\n';                  
            }
            else {
                if(player.bmid) playerIds += `[BM](${bmUrl}${player.bmid}) `;
                else if(player.steamid) playerIds += `[STEAM](${steamUrl}${player.steamid})`;
                playerIds += '\n';
            }
            playerStatus += `${player.status === true ? `:green_circle: [${player.playTime}]\n` : ':red_circle:\n'}`;
        }

        if(playerNames === '') playerNames = '-';
        if(playerIds === '') playerIds = '-';
        if(playerStatus === '') playerStatus = '-';
        return module.exports.getEmbed({
            title: (tracker.name) === undefined ? 'Tracker' : tracker.name,
            description:
            `**Server: **\`${(server?.name) ? server.name : '-'}\`\n` +
            `**ServerID:** \`${(tracker.serverId !== null) ? tracker.serverId : '-'}\`\n` +
            `**Server status:** ${server?.status ? ':green_circle:' : ':red_circle:'}\n` +
            `**Online:** \`${tracker.onlineCount} / ${tracker.players.length}\``,
            color: 0x1198F1,
            timestamp: true,
            fields: [
                {name: 'Name', value: playerNames, inline: true},
                {name: 'ID', value: playerIds, inline: true},
                {name: 'Status', value: playerStatus, inline: true},
            ],
        });
    },
    getPlayerJoinEmbed: function(player, serverName){
        return module.exports.getEmbed({
            title: `${player.name} just connected.`,
            footer: { text: serverName },
            timestamp: true,
            color: 0x32a852,
        });
    },
    getPlayerLeaveEmbed: function(player, serverName){
        let [hours, minutes] = player.playTime.split(':');
        if(hours[0] == '0') hours = hours[1];
        if(minutes[0] == '0') minutes = minutes[1];
        return module.exports.getEmbed({
            title: `${player.name} just disconnected. (${player.playTime})`,
            //description: `**Session duration:** ${(minutes != '00' || hours != '00') ? `${(hours != '00') ? `${hours} h` : ''}${(minutes != '00' ? ` ${minutes} m` : '')}` : ''}`,
            footer: { text: serverName },
            timestamp: true,
            color: 0xa83232,
        });
    },
    getPlayerNameChangeEmbed: function(player, serverName){
        return module.exports.getEmbed({
            title: 'Name change',
            description: `**Old name:** \`\`\`${player.prevName}\`\`\`\n**New name:** \`\`\`${player.name}\`\`\``,
            footer: { text: serverName },
            timestamp: true,
            color: 0xffa500,
        });
    },
    getAllOfflineEmbed: function(serverName){
        return module.exports.getEmbed({
            title: 'Everyone just went offline!',
            footer: { text: serverName },
            timestamp: true,
            color: 0xa83232,
        });
    },
    getSleepEmbed: function(data){
        const bedtime = 
            bold(data.averageBedTime) + 
            ` ±(~${data.averageBedTimeDeviationHrs}h)` +
            ` (GMT+${data.tzOffsetHrs})`;

        const wakeUpTime =
            bold(data.averageWakeUpTime) +
            ` ±(~${data.averageWakeUpTimeDeviationHrs}h)` +
            ` (GMT+${data.tzOffsetHrs})`;

        return module.exports.getEmbed({
            title: `${data.name}`,
            description: 
            `Average bedtime: ${bedtime}
            Average wake-up time: ${wakeUpTime}\n
            Average sleep time: ${bold(data.averageSleepTimeHrs + " hours")}
            Shortest sleep time: ${bold(data.minSleepTimeHrs + " hours")}`,
            timestamp: true,
            color: 0x000000,
        });
    },
    getTrackerSleepEmbed: function(players){
        const bmUrl = 'https://www.battlemetrics.com/players/';
        let names = '';
        let playerIds = '';
        let sleepData = '';
        const hasUndefined = (obj) => {
            if(obj?.averageBedTime) return false;
            if(obj?.averageWakeUpTime) return false;
            return true; 
        };
        for(const player of players){
            if(!player?.bmid) continue;
            names += `${player.name}\n\n\n`;

            playerIds += `[BM](${bmUrl}${player.bmid})\n\n\n`;
            if(!hasUndefined(player)){
                sleepData +=
                'Bedtime: ' +
                bold(player.averageBedTime) + 
                ` ±(~${player.averageBedTimeDeviationHrs}h)` +
                ` (GMT+${player.tzOffsetHrs}\n` +
                'Wakeup: ' +
                bold(player.averageWakeUpTime) +
                ` ±(~${player.averageWakeUpTimeDeviationHrs}h)` +
                ` (GMT+${player.tzOffsetHrs})\n\n`;
            } else {
                sleepData += `Not enough data\n\n\n`;
            }
        }
        
        return module.exports.getEmbed({
            fields: [
                { name: 'Name', value: names, inline: true },
                { name: 'ID', value: playerIds, inline: true },
                { name: 'Sleep', value: sleepData, inline: true},
            ],
            timestamp: true,
            color: 0xfff000,
        });
    },
    getPlayerTrackerEmbed: function(tracker) {
        const bmServerUrl = 'https://www.battlemetrics.com/servers/';
        const bmPlayerUrl = 'https://www.battlemetrics.com/players/';

        const playerInfo = tracker.players[0];
        const serverName = playerInfo.lastSeen.serverName;

        const nameHistory = playerInfo.nameHistory.slice(0, 10);
        const lastOnline = new Date(playerInfo.lastSeen.time);

        return module.exports.getEmbed({
            title: `${tracker.name}`,
            fields: [
                { name: 'Current name', value: `[${playerInfo.name}](${bmPlayerUrl}${playerInfo.bmid})`, inline: true },
                { name: 'Status', value: `${playerInfo.status ? ":green_circle:" : ":red_circle:"}`, inline: true },
                playerInfo.status ?
                    { name: 'Current server', value: `[${serverName}](${bmServerUrl}${playerInfo.serverId})` }
                :
                { name: 'Last Seen', value: `<t:${Math.round(lastOnline.getTime()/1000)}:f>` }, 
                { name: 'Server', value: `[${serverName}](${bmServerUrl}${playerInfo.serverId})`, inline: true },
                { name: 'Playtime (all-time)', value: `${playerInfo.playTime}h - ${playerInfo.playTime * 1.9}h` },
                { name: 'Name', value: `${nameHistory.map(n => n.name).join('\n')}`, inline: true },
                { name: 'Last Seen', value: `${nameHistory.map(n => `<t:${Math.round((new Date(n.lastSeen)).getTime()/1000)}:f>`).join('\n')}`, inline: true },
            ],
            color: 0x1198F1,
            timestamp: true,
        });
    },
}