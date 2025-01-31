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
        type: 4,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: ['ViewChannel']
          },
          {
            id: targetRole,
            allow: ['ViewChannel', 'ManageChannels']
          }
        ]
      });
    }

    const overwrites = [
      { id: interaction.guild.id, deny: ['ViewChannel'] },
      { id: interaction.user.id, allow: ['ViewChannel', 'SendMessages'] },
      { id: targetRole, allow: ['ViewChannel', 'SendMessages', 'ManageMessages'] }
    ];

    const ticketNumber = getNextTicketNumber();
    const ticketId = `ticket-${ticketNumber}`;
    const channel = await interaction.guild.channels.create({
      name: ticketId,
      type: 0,
      parent: categoryChannel.id,
      permissionOverwrites: overwrites,
      topic: `Ticket de ${category} - Usuario: ${interaction.user.tag}`
    });

    tickets[ticketId] = {
      user: interaction.user.id,
      category: category,
      description: description,
      created: Date.now(),
      parentCategory: categoryChannel.id
    };

    const embed = new EmbedBuilder()
      .setTitle(`📨 Ticket #${ticketNumber}`)
      .addFields(
        { name: 'Usuario', value: interaction.user.toString(), inline: true },
        { name: 'Categoría', value: category.toUpperCase(), inline: true },
        { name: 'Descripción', value: description }
      )
      .setFooter({ text: `Categoría: ${categoryChannel.name}` })
      .setColor(0x5865F2);

    const userButton = new ButtonBuilder()
      .setCustomId('close_ticket')
      .setLabel('Cerrar Ticket')
      .setStyle(ButtonStyle.Danger)
      .setEmoji('🔒');

    await channel.send({
      content: `${interaction.user} <@&${targetRole}>`,
      embeds: [embed],
      components: [new ActionRowBuilder().addComponents(userButton)]
    });

    await interaction.editReply(`✅ Ticket creado en la categoría ${categoryChannel}: ${channel}`);
  }
};