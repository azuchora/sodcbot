const ExtendedClient = require('../structures/ExtendedClient');
const { log } = require('./logger');
const { Guild, ChannelType } = require('discord.js');
const { getTrackerEmbed, getPlayerJoinEmbed, getPlayerLeaveEmbed, getPlayerNameChangeEmbed, getAllOfflineEmbed, getPlayerTrackerEmbed } = require('../components/discordEmbeds');
const { getTrackerButtons, getPlayerTrackerButtons } = require('../components/discordButtons');

module.exports = {
    /**
     * 
     * @param {ExtendedClient} client 
     */
    getChannel: async function (client, channelId){
        try{
            const channel = await client.channels.fetch(channelId);
            return channel;
        } catch(e){
            log(`Couldnt get channel ${channelId}`, 'warn');
            return null;
        }
    },
    /**
     * 
     * @param {ExtendedClient} client
     */
    getMessage: async function (client, channel, messageId){
        try{
            const message = await channel.messages.fetch(messageId);
            return message;
        } catch(e){
            log(`Couldnt get message ${messageId}`, 'warn');
            return null;
        }
    },
    /**
     * 
     * @param {ExtendedClient} client 
     */
    editMessage: async function (message, options = {}){
        try{
            const editedMessage = await message.edit(options);
            return editedMessage;
        } catch(e){
            log(`Failed to edit message ${message.id}`, 'warn');
            return null;
        }
    },
    /**
     * 
     * @param {ExtendedClient} client
     * @param {'playerJoin' | 'playerLeave' | 'playerNameChange' | 'allOffline' | 'serverOff' | 'serverOn' | undefined} type
     */
    sendTrackerThreadMessage: async function(client, type, tracker, content = {}){
        if(!type) return;
        const channel = await module.exports.getChannel(client, tracker.channelId); 
        const thread = channel.threads.cache.find(t => t.id === tracker.threadId);
        if(!thread){
            log(`Couldn't get thread: ${tracker.threadId}`, 'warn');
            return;
        }
        switch(type){
            case 'playerJoin':
                if(!content?.serverName) return;
                await thread.send({ embeds: [getPlayerJoinEmbed(content.player, content.serverName)] });
                break;
            
            case 'playerLeave':
                if(!content?.serverName) return;
                await thread.send({ content: (content.everyone && tracker.isSingle) ? '@everyone' : '', embeds: [getPlayerLeaveEmbed(content.player, content.serverName)] })
                break;
            
            case 'playerNameChange':
                if(!content?.serverName) return;
                await thread.send({ embeds: [getPlayerNameChangeEmbed(content.player, content.serverName)] })
                break;
            
            case 'allOffline':
                if(!content?.serverName) return;
                await thread.send({ content: (content.everyone) ? '@everyone' : '', embeds: [getAllOfflineEmbed(content.serverName)] });
                break;
        }
    },
    /**
     * 
     * @param {ExtendedClient} client
     * @param {Guild} guild
    */
   refreshTracker: async function (client, tracker, serverInfo, guild = null, guildInfo = null){
       try{
            let channel = await module.exports.getChannel(client, tracker.channelId);
            let category = await module.exports.getChannel(client, tracker.categoryId);
            if(!channel){
                const oldChannelId = tracker.channelId;
                let wasDeleted = false;
                if(tracker.categoryId !== null){
                    if(!category){
                        const oldCategoryId = tracker.categoryId;
                        wasDeleted = true;
                        category = await guild.channels.create({
                            name: tracker.categoryName,
                            type: ChannelType.GuildCategory,
                        });
                        for(const t of guildInfo?.trackers){
                            if(t.categoryId == oldCategoryId){
                                t.categoryId = category.id;
                            }
                        }
                    }
                }
                channel = (tracker.categoryId === null) ?
                await guild.channels.create({
                    name: tracker.channelName,
                    type: ChannelType.GuildText,
                }) :
                await category.children.create({
                    name: tracker.channelName,
                    type: ChannelType.GuildText,
                });
                for(const t of guildInfo?.trackers){
                    if(t.channelId === oldChannelId){
                        t.channelId = channel.id;
                    }
                }
                if(wasDeleted) await channel.setParent(category);
            }
            tracker.categoryName = (category) ? category.name : null;
            tracker.categoryId = (channel.parent?.id) ? channel.parent.id : null;
            tracker.categoryName = (channel.parent?.name) ? channel.parent.name : null;
            tracker.channelName = channel.name;
            let message = await module.exports.getMessage(client, channel, tracker.messageId);
            let thread;
            if(!message){
                message = await channel.send({
                    embeds: [tracker.isSingle ? getPlayerTrackerEmbed(tracker) : getTrackerEmbed(tracker, serverInfo)],
                    components: tracker.isSingle ? getPlayerTrackerButtons(tracker) : getTrackerButtons(tracker),
                });
                tracker.messageId = message.id;
                const oldThread = channel.threads.cache.find(t => t.id === tracker.threadId);
                await oldThread.delete();
                tracker.threadId = null;
            } else {
                await module.exports.editMessage(message, {
                    embeds: [tracker.isSingle ? getPlayerTrackerEmbed(tracker) : getTrackerEmbed(tracker, serverInfo)],
                    components: tracker.isSingle ? getPlayerTrackerButtons(tracker) : getTrackerButtons(tracker),
                });
            }
            if(!message.hasThread){
                thread = await message.startThread({
                    // name: `'${tracker.name}' logs`,
                    name: 'logs',
                });
                tracker.threadId = thread.id;
            }

                // thread = await (channel.threads.cache.find(t => t.id === tracker.threadId));
                // if(thread) await thread.setName(`'${tracker.name}' logs`);

            log(`Refreshed ${(tracker?._id) ? `tracker ${tracker._id}` : 'new tracker'}`, 'info');
        } catch(e){
            log(`Failed to update tracker ${tracker._id}`, 'warn');
            console.log(e);
        }
    },
};