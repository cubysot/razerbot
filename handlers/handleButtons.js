const { 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle 
} = require('discord.js');
const fs = require('fs');
const { TICKET_CONFIG, IP_DATA } = require('../utils/config');
const { generateHTMLTranscript } = require('../utils/transcript');
const { tickets } = require('./handleModals');

module.exports = {
  handleIPButtons: async (interaction) => {
    const responses = {
      'java_ip': `**IP Java Edition**\n🔗 Conéctate a: \`${IP_DATA.JAVA}\``,
      'bedrock_ip': `**IP Bedrock Edition**\n🔗 IP: \`${IP_DATA.BEDROCK.IP}\`\n⚙️ Puerto: \`${IP_DATA.BEDROCK.PORT}\``
    };
    
    await interaction.reply({
      content: responses[interaction.customId],
      ephemeral: true
    });
  },

  handleTicketButtons: async (interaction) => {
    const ticketId = interaction.channel.name;
    const ticket = tickets[ticketId];
    
    if (!ticket) {
      return interaction.reply({
        content: '❌ No se pudo encontrar la información del ticket',
        ephemeral: true
      });
    }

    switch (interaction.customId) {
      case 'close_ticket':
        await interaction.channel.permissionOverwrites.edit(ticket.user, {
          ViewChannel: false,
          SendMessages: false
        });

        const staffButtons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('transcribe')
            .setLabel('Transcribir')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('📄'),
          new ButtonBuilder()
            .setCustomId('delete')
            .setLabel('Eliminar')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('🗑️'),
          new ButtonBuilder()
            .setCustomId('reopen')
            .setLabel('Reabrir')
            .setStyle(ButtonStyle.Success)
            .setEmoji('🔓')
        );

        await interaction.reply({ 
          content: 'Ticket cerrado. Acciones disponibles:',
          components: [staffButtons]
        });
        break;

      case 'transcribe':
        await interaction.deferReply();
        const transcript = await generateHTMLTranscript(interaction.channel);
        
        await interaction.editReply({
          files: [{
            attachment: transcript,
            name: `transcripcion-${interaction.channel.name}.html`
          }]
        });
        
        fs.unlinkSync(transcript);
        break;

      case 'delete':
        delete tickets[interaction.channel.name];
        await interaction.channel.delete('Ticket eliminado por staff');
        break;

      case 'reopen':
        await interaction.channel.permissionOverwrites.edit(ticket.user, {
          ViewChannel: true,
          SendMessages: true
        });
        await interaction.update({ components: [] });
        break;
    }
  }
};