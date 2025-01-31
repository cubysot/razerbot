const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

const userSelections = new Map();

module.exports = {
  userSelections,
  handleSelectCategory: async (interaction) => {
    const category = interaction.values[0];
    userSelections.set(interaction.user.id, category);
    
    const modal = new ModalBuilder()
      .setCustomId('ticket_modal')
      .setTitle(`Ticket: ${category.toUpperCase()}`);

    const input = new TextInputBuilder()
      .setCustomId('description')
      .setLabel('Describe tu solicitud')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    modal.addComponents(new ActionRowBuilder().addComponents(input));
    await interaction.showModal(modal);
  }
};