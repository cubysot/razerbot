const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ip')
    .setDescription('Muestra las IPs del servidor'),
  async execute(interaction) {
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

    await interaction.reply({
      content: '**Selecciona tu versión de Minecraft:**',
      components: [row]
    });
  }
};