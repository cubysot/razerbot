const { handleSelectCategory } = require('../handlers/handleSelectMenu');
const { handleTicketModal } = require('../handlers/handleModals');
const { handleIPButtons, handleTicketButtons } = require('../handlers/handleButtons');

module.exports = {
  name: 'interactionCreate',
  execute: async (interaction) => {
    try {
      if (interaction.isStringSelectMenu() && interaction.customId === 'select_category') {
        await handleSelectCategory(interaction);
        return; // Asegúrate de salir después de manejar la interacción
      }
      
      if (interaction.isModalSubmit() && interaction.customId === 'ticket_modal') {
        await handleTicketModal(interaction);
        return; // Asegúrate de salir después de manejar la interacción
      }
      
      if (interaction.isButton()) {
        if (['java_ip', 'bedrock_ip'].includes(interaction.customId)) {
          await handleIPButtons(interaction);
        } else {
          await handleTicketButtons(interaction);
        }
        return; // Asegúrate de salir después de manejar la interacción
      }
      
      if (interaction.isCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) return;
        await command.execute(interaction);
        return; // Asegúrate de salir después de manejar la interacción
      }
    } catch (error) {
      console.error('Error en interactionCreate:', error);

      // Verifica si la interacción ya ha sido respondida
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ 
          content: '❌ Ocurrió un error al procesar la interacción', 
          ephemeral: true 
        });
      } else {
        await interaction.reply({ 
          content: '❌ Ocurrió un error al procesar la interacción', 
          ephemeral: true 
        });
      }
    }
  }
};