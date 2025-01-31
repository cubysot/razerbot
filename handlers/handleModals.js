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
    await interaction.deferReply({ flags: 'Ephemeral' });
    
    const category = userSelections.get(interaction.user.id);
    if (!category) {
      return interaction.editReply('❌ No se pudo encontrar la categoría seleccionada');
    }
    
    const description = interaction.fields.getTextInputValue('description');

    let categoryChannel = interaction.guild.channels.cache.find(c => 
      c.name === TICKET_CONFIG.TICKETS_CATEGORY && c.type === 4
    );
    
    if (!categoryChannel) {
      categoryChannel = await interaction.guild.channels.create({
        name: TICKET_CONFIG.TICKETS_CATEGORY,
        type: 4
      });
    }

    const isPrivate = TICKET_CONFIG.PRIVATE_CATEGORIES.includes(category.toUpperCase());
    const overwrites = [
      { id: interaction.guild.id, deny: ['ViewChannel'] },
      { id: interaction.user.id, allow: ['ViewChannel', 'SendMessages'] }
    ];

    if (isPrivate) {
      overwrites.push({
        id: TICKET_CONFIG.ADMIN_ROLE,
        allow: ['ViewChannel', 'SendMessages']
      });
    } else {
      overwrites.push({
        id: TICKET_CONFIG.STAFF_ROLE,
        allow: ['ViewChannel', 'SendMessages']
      });
    }

    const ticketNumber = getNextTicketNumber();
    const ticketId = `ticket-${ticketNumber}`;
    const channel = await interaction.guild.channels.create({
      name: ticketId,
      type: 0,
      parent: categoryChannel.id,
      permissionOverwrites: overwrites
    });

    tickets[ticketId] = {
      user: interaction.user.id,
      category: category,
      description: description,
      created: Date.now()
    };

    const embed = new EmbedBuilder()
      .setTitle(`📨 Ticket #${ticketNumber}`)
      .addFields(
        { name: 'Usuario', value: interaction.user.toString(), inline: true },
        { name: 'Categoría', value: category.toUpperCase(), inline: true },
        { name: 'Descripción', value: description }
      )
      .setColor(0x5865F2);

    const userButton = new ButtonBuilder()
      .setCustomId('close_ticket')
      .setLabel('Cerrar Ticket')
      .setStyle(ButtonStyle.Danger)
      .setEmoji('🔒');

    await channel.send({
      content: `${interaction.user} ${isPrivate ? `<@&${TICKET_CONFIG.ADMIN_ROLE}>` : `<@&${TICKET_CONFIG.STAFF_ROLE}>`}`,
      embeds: [embed],
      components: [new ActionRowBuilder().addComponents(userButton)]
    });

    await interaction.editReply(`✅ Ticket creado: ${channel}`);
  }
};