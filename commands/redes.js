const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { SOCIAL_MEDIA } = require('../utils/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('redes')
    .setDescription('Muestra las redes sociales del servidor de Razercraft.'),
  async execute(interaction) {
    // Crear un Embed con un diseño más atractivo
    const embed = new EmbedBuilder()
      .setTitle('🌐 Redes Sociales de Razercraft')
      .setDescription('¡Conéctate con nosotros y síguenos en nuestras redes sociales para estar al tanto de todas las novedades!')
      .setColor(0x5865F2) // Color azul de Discord
      .setThumbnail(interaction.guild.iconURL()) // URL de una imagen (logo de Razercraft)
      .addFields(
        { name: '📌 Discord', value: `[Únete a nuestro servidor](${SOCIAL_MEDIA.DISCORD})`, inline: true },
        { name: '🎥 YouTube', value: `[Suscríbete a nuestro canal](${SOCIAL_MEDIA.YOUTUBE})`, inline: true },
        { name: '🐦 Twitter', value: `[Síguenos en Twitter](${SOCIAL_MEDIA.TWITTER})`, inline: true },
        { name: '📸 Instagram', value: `[Síguenos en Instagram](${SOCIAL_MEDIA.INSTAGRAM})`, inline: true },
        { name: '🎵 TikTok', value: `[Síguenos en TikTok](${SOCIAL_MEDIA.TIKTOK})`, inline: true }
      )
      .setFooter({ text: '¡Gracias por ser parte de la comunidad Razercraft!', iconURL: interaction.guild.iconURL() });

    // Crear botones para cada red social
    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Discord')
        .setURL(SOCIAL_MEDIA.DISCORD)
        .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
        .setLabel('YouTube')
        .setURL(SOCIAL_MEDIA.YOUTUBE)
        .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
        .setLabel('Twitter')
        .setURL(SOCIAL_MEDIA.TWITTER)
        .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
        .setLabel('Instagram')
        .setURL(SOCIAL_MEDIA.INSTAGRAM)
        .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
        .setLabel('TikTok')
        .setURL(SOCIAL_MEDIA.TIKTOK)
        .setStyle(ButtonStyle.Link)
    );

    // Responder con el Embed y los botones
    await interaction.reply({
      embeds: [embed],
      components: [buttons]
    });
  }
};