const { SlashCommandBuilder } = require('discord.js');
const { Interaction } = require('discord.js');
const ExtendedClient = require('../../structures/ExtendedClient');
const { getEmbed } = require('../../components/discordEmbeds');
const { getTestButton } = require('../../components/discordButtons');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('button')
        .setDescription('test buttons'),
    /**
     * 
     * @param {ExtendedClient} client 
     * @param {Interaction} interaction 
     */ 
    async execute(client, interaction){

        const embed = getEmbed({
            description: 'test',
        });
        
        await interaction.reply({ embeds: [embed], components: [getTestButton()]});
    }
};
