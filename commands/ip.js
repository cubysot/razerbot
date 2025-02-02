const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ip')
    .setDescription('Muestra las IPs del servidor de Razercraft.'),
  async execute(interaction) {
    // Crear un Embed con un diseño más atractivo
    const embed = new EmbedBuilder()
      .setTitle('🎮 IPs de Razercraft')
      .setDescription('¡Conéctate a nuestro servidor de Minecraft! Selecciona tu versión para obtener la IP correspondiente.')
      .setColor(0x00FF00) // Color verde (puedes cambiarlo)
      .setThumbnail(interaction.guild.iconURL())// URL de una imagen (logo de Razercraft)
      .addFields(
        { name: '🟢 Java Edition', value: 'Haz clic en el botón **Java** para obtener la IP.', inline: true },
        { name: '🔵 Bedrock Edition', value: 'Haz clic en el botón **Bedrock** para obtener la IP.', inline: true }
      )
      .setFooter({ text: '¡Esperamos verte en el servidor!', iconURL: interaction.guild.iconURL() });

    // Crear botones para seleccionar la versión
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('java_ip')
        .setLabel('Java')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('🟢'), // Emoji para Java
      new ButtonBuilder()
        .setCustomId('bedrock_ip')
        .setLabel('Bedrock')
        .setStyle(ButtonStyle.Success)
        .setEmoji('🔵') // Emoji para Bedrock
    );

    // Responder con el Embed y los botones
    await interaction.reply({
      embeds: [embed],
      components: [row]
    });
  }
};