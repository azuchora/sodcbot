const { EmbedBuilder } = require('discord.js');

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
            recentNames = nameHistory.slice(0, 5);
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
                {name: 'Total playtime', value: `${playerInfo.playTime}h - ${playerInfo.playTime * 2.1}h`},
                {name: 'Name history', value: previousNames, inline: true},
                {name: 'Last seen', value: lastSeen, inline: true},
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
            if(tracker.players.length < 12){
                if(player.bmid) playerIds += `[BM](${bmUrl}${player.bmid}) `;
                if(player.steamid) playerIds += (player.bmid) ? `| [STEAM](${steamUrl}${player.steamid})` : `[STEAM](${steamUrl}${player.steamid})`;
                playerIds += '\n';                  
            }
            else {
                if(player.steamid) playerIds += `${player.steamid}`;
                else if(player.bmid) playerIds += `${player.bmid}\n`;
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
            `**ServerID:** \`${tracker.serverId}\`\n` +
            `**Server status:** ${server?.status ? ':green_circle:' : ':red_circle:'}\n` +
            `**Online:** \`${(tracker.players.filter((p)=>p.status)).length} / ${tracker.players.length}\``,
            color: 0x1198F1,
            timestamp: true,
            fields: [
                {name: 'Name', value: playerNames, inline: true},
                {name: 'ID', value: playerIds, inline: true},
                {name: 'Status', value: playerStatus, inline: true},
            ],
        });
    }
}