const ExtendedClient = require('../structures/ExtendedClient');
const { log } = require('./logger');
const { Guild, ChannelType } = require('discord.js');
const { getTrackerEmbed } = require('../components/discordEmbeds');
const { getTrackerButtons } = require('../components/discordButtons');
const { getGuild } = require('./guilds');
const { updateGuild } = require('../database/queries/guilds');

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
     * @param {Guild} guild
     */
    refreshTracker: async function (client, tracker, serverInfo, guild = null, guildInfo = null){
        try{
            let category = await module.exports.getChannel(client, tracker.categoryId);
            let wasDeleted = false;
            if(!category && (tracker.categoryId !== null && tracker.categoryId !== undefined)){
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
            tracker.categoryName = category.name;

            let channel = await module.exports.getChannel(client, tracker.channelId);
            if(!channel){
                const oldChannelId = tracker.channelId;
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
            }
            if(wasDeleted){
                channel.setParent(category);
            } else {
                tracker.categoryId = channel.parent?.id;
                tracker.categoryName = channel.parent?.name;
            }
            tracker.channelName = channel.name;
            const message = await module.exports.getMessage(client, channel, tracker.messageId);
            if(!message){
                const newMessage = await channel.send({
                    embeds: [getTrackerEmbed(tracker, serverInfo)],
                    components: getTrackerButtons(tracker),
                });
                tracker.messageId = newMessage.id;
            } else {
                await module.exports.editMessage(message, {
                    embeds: [getTrackerEmbed(tracker, serverInfo)],
                    components: getTrackerButtons(tracker),
                });
            }
            log(`Updated tracker ${tracker._id}`, 'info');
        } catch(e){
            log(`Failed to update tracker ${tracker._id}`, 'warn');
            console.log(e);
        }
    },
};