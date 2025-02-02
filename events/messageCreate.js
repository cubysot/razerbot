const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { TICKET_CONFIG } = require('../utils/config');

module.exports = {
  name: 'messageCreate',
  execute: async (message) => {
    if (message.author.bot) return;

    // Comando !ip
    if (message.content.toLowerCase() === '!ip') {
      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('java_ip')
            .setLabel('Java')
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId('bedrock_ip')
            .setLabel('Bedrock')
            .setStyle(ButtonStyle.Success),
        );

      await message.reply({
        content: '**Selecciona tu versión de Minecraft:**',
        components: [row]
      });
    }

    // Comando !ticket
    if (message.content.toLowerCase() === '!ticket') {
      const embed = new EmbedBuilder()
        .setTitle(':ticket: Soporte de RazerCraft')
        .setDescription('¡Hola! ¿Necesitas ayuda? Crea un ticket para asistencia.\n\n**¿Cómo funciona?**\n1. Haz clic en :envelope_with_arrow:\n2. Elige una categoría\n3. Describe tu consulta')
        .setColor(0x5865F2)
        .setThumbnail(interaction.guild.iconURL())
        .setFooter({ text: 'Soporte 24/7 | RazerCraft Network' });

      const categories = [
        ...TICKET_CONFIG.PUBLIC_CATEGORIES, 
        ...TICKET_CONFIG.PRIVATE_CATEGORIES
      ].map(c => ({ label: c, value: c.toLowerCase() }));

      const menu = new StringSelectMenuBuilder()
        .setCustomId('select_category')
        .setPlaceholder('Elige categoría')
        .addOptions(categories);

      await message.channel.send({
        embeds: [embed],
        components: [new ActionRowBuilder().addComponents(menu)]
      });
    }
  }
};