const ExtendedClient = require('../structures/ExtendedClient');
const { log } = require('./logger');
const { Guild, ChannelType } = require('discord.js');
const { getTrackerEmbed } = require('../components/discordEmbeds');
const { getTrackerButtons } = require('../components/discordButtons');

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
    refreshTracker: async function (client, tracker, serverInfo, guild){
        try{
            let category = await module.exports.getChannel(client, tracker.categoryId);
            if(!category && tracker.categoryId !== null){
                category = await guild.channels.create({
                    name: tracker.categoryName,
                    type: ChannelType.GuildCategory,
                });
                tracker.categoryId = category.id;
            }
            tracker.categoryName = category.name;

            let channel = await module.exports.getChannel(client, tracker.channelId);
            if(!channel){
                channel = (tracker.categoryId === null) ?
                await guild.channels.create({
                    name: tracker.channelName,
                    type: ChannelType.GuildText,
                }) :
                await category.children.create({
                    name: tracker.channelName,
                    type: ChannelType.GuildText,
                });
                tracker.channelId = channel.id;
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