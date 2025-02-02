const { 
  ModalBuilder, 
  TextInputBuilder, 
  TextInputStyle, 
  ActionRowBuilder, 
  EmbedBuilder 
} = require('discord.js');

const userSelections = new Map();

module.exports = {
  userSelections,
  handleSelectCategory: async (interaction) => {
    const category = interaction.values[0];
    userSelections.set(interaction.user.id, category);

    // Crear el modal
    const modal = new ModalBuilder()
      .setCustomId('ticket_modal')
      .setTitle(`Ticket: ${category.toUpperCase()}`);

    const input = new TextInputBuilder()
      .setCustomId('description')
      .setLabel('Describe tu solicitud')
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder('Escribe aquí los detalles de tu problema o consulta...')
      .setRequired(true);

    modal.addComponents(new ActionRowBuilder().addComponents(input));

    // Mostrar el modal directamente
    await interaction.showModal(modal);
  }
};