const { 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle 
} = require('discord.js');
const { TICKET_CONFIG } = require('../utils/config');
const { userSelections } = require('./handleSelectMenu');

let tickets = {};

function getNextTicketNumber() {
  const numbers = Object.keys(tickets).map(k => parseInt(k.split('-')[1]) || 0);
  return (Math.max(...numbers, 0) + 1).toString().padStart(4, '0');
}

module.exports = {
  tickets,
  handleTicketModal: async (interaction) => {
    await interaction.deferReply({ flags: 'Ephemeral' }); // Cambiado de `ephemeral: true` a `flags: 'Ephemeral'`
    
    const category = userSelections.get(interaction.user.id);
    if (!category) {
      return interaction.editReply('❌ No se pudo encontrar la categoría seleccionada');
    }
    
    const description = interaction.fields.getTextInputValue('description');

    // Determinar si es categoría pública o privada
    const isPublic = TICKET_CONFIG.PUBLIC_CATEGORIES.includes(category.toUpperCase()); // Ahora funciona porque es un array
    const targetRole = isPublic ? TICKET_CONFIG.STAFF_ROLE : TICKET_CONFIG.ADMIN_ROLE;

    // Buscar o crear la categoría específica
    let categoryChannel = interaction.guild.channels.cache.find(c => 
      c.name === category.toUpperCase() && c.type === 4
    );
    
    if (!categoryChannel) {
      categoryChannel = await interaction.guild.channels.create({
        name: category.toUpperCase(),
        type: 4, // Tipo de categoría
        permissionOverwrites: [
          {
            id: interaction.guild.id, // ID del servidor
            deny: ['ViewChannel'] // Denegar ver el canal a todos
          },
          {
            id: targetRole, // ID del rol de staff o admin
            allow: ['ViewChannel', 'ManageChannels'] // Permitir ver y gestionar el canal
          }
        ]
      });
    }

    // Configurar permisos para el canal de ticket
    const overwrites = [
      {
        id: interaction.guild.id, // ID del servidor
        deny: ['ViewChannel'] // Denegar ver el canal a todos
      },
      {
        id: interaction.user.id, // ID del usuario que creó el ticket
        allow: ['ViewChannel', 'SendMessages'] // Permitir ver y enviar mensajes
      },
      {
        id: targetRole, // ID del rol de staff o admin
        allow: ['ViewChannel', 'SendMessages', 'ManageMessages'] // Permitir ver, enviar y gestionar mensajes
      }
    ];

    // Crear el canal de ticket
    const ticketNumber = getNextTicketNumber();
    const ticketId = `ticket-${ticketNumber}`;
    const channel = await interaction.guild.channels.create({
      name: ticketId,
      type: 0, // Tipo de canal de texto
      parent: categoryChannel.id, // Categoría padre
      permissionOverwrites: overwrites, // Permisos
      topic: `Ticket de ${category} - Usuario: ${interaction.user.tag}` // Tema del canal
    });

    // Guardar la información del ticket
    tickets[ticketId] = {
      user: interaction.user.id,
      category: category,
      description: description,
      created: Date.now(),
      parentCategory: categoryChannel.id
    };

    // Crear un Embed para el ticket
    const embed = new EmbedBuilder()
      .setTitle(`📨 Ticket #${ticketNumber}`)
      .addFields(
        { name: 'Usuario', value: interaction.user.toString(), inline: true },
        { name: 'Categoría', value: category.toUpperCase(), inline: true },
        { name: 'Descripción', value: description }
      )
      .setFooter({ text: `Categoría: ${categoryChannel.name}` })
      .setColor(0x5865F2);

    // Crear un botón para cerrar el ticket
    const userButton = new ButtonBuilder()
      .setCustomId('close_ticket')
      .setLabel('Cerrar Ticket')
      .setStyle(ButtonStyle.Danger)
      .setEmoji('🔒');

    // Enviar el Embed y el botón al canal de ticket
    await channel.send({
      content: `${interaction.user} <@&${targetRole}>`,
      embeds: [embed],
      components: [new ActionRowBuilder().addComponents(userButton)]
    });

    // Crear un Embed para notificar al usuario que el ticket se ha creado
    const successEmbed = new EmbedBuilder()
      .setTitle('✅ Ticket Creado')
      .setDescription(`Se ha creado un ticket en la categoría **${categoryChannel.name}**.`)
      .addFields(
        { name: 'Categoría', value: categoryChannel.name, inline: true },
        { name: 'Canal', value: channel.toString(), inline: true },
        { name: 'Descripción', value: description }
      )
      .setColor(0x00FF00) // Color verde
      .setFooter({ text: 'RazerCraft Network', iconURL: interaction.guild.iconURL() });

    // Responder al usuario con el Embed
    await interaction.editReply({ embeds: [successEmbed] });
  }
};