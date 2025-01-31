const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const { TICKET_CONFIG } = require('../utils/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Crea un ticket de soporte'),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle(':ticket: Soporte de RazerCraft')
      .setDescription('¡Hola! ¿Necesitas ayuda? Crea un ticket para asistencia.\n\n**¿Cómo funciona?**\n1. Haz clic en :envelope_with_arrow:\n2. Elige una categoría\n3. Describe tu consulta')
      .setColor(0x5865F2)
      .setThumbnail('https://i.imgur.com/9ZQ7ZKL.png')
      .setFooter({ text: 'Soporte 24/7 | RazerCraft Network' });

    const categories = [
      ...TICKET_CONFIG.PUBLIC_CATEGORIES, 
      ...TICKET_CONFIG.PRIVATE_CATEGORIES
    ].map(c => ({ label: c, value: c.toLowerCase() }));

    const menu = new StringSelectMenuBuilder()
      .setCustomId('select_category')
      .setPlaceholder('Elige categoría')
      .addOptions(categories);

    await interaction.reply({
      embeds: [embed],
      components: [new ActionRowBuilder().addComponents(menu)]
    });
  }
};