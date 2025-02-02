const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const { TICKET_CONFIG } = require('../utils/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Crea un ticket de soporte en RazerCraft.'),
  async execute(interaction) {
    // Crear un Embed con un diseño más atractivo
    const embed = new EmbedBuilder()
      .setTitle('🎫 Soporte de RazerCraft')
      .setDescription('¡Hola! ¿Necesitas ayuda? Crea un ticket para recibir asistencia personalizada.\n\n**¿Cómo funciona?**\n1. Haz clic en el menú de abajo.\n2. Elige una categoría.\n3. Describe tu consulta en el formulario.')
      .setColor(0x5865F2) // Color azul de Discord
      .setThumbnail(interaction.guild.iconURL()) // Usar el ícono del servidor
      .setFooter({ text: 'Soporte 24/7 | RazerCraft Network', iconURL: interaction.guild.iconURL() });

    // Crear opciones para el menú de selección
    const categories = [
      ...TICKET_CONFIG.PUBLIC_CATEGORIES, 
      ...TICKET_CONFIG.PRIVATE_CATEGORIES
    ].map(c => ({ 
      label: c, 
      value: c.toLowerCase(),
      description: `Selecciona para crear un ticket de ${c}` // Descripción para cada opción
    }));

    // Crear el menú de selección
    const menu = new StringSelectMenuBuilder()
      .setCustomId('select_category')
      .setPlaceholder('Elige una categoría')
      .addOptions(categories);

    // Crear una fila de componentes (menú de selección)
    const row = new ActionRowBuilder().addComponents(menu);

    // Responder con el Embed y el menú de selección
    await interaction.reply({
      embeds: [embed],
      components: [row]
    });
  }
};