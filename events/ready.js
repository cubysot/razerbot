const { REST, Routes } = require('discord.js');

module.exports = {
  name: 'ready',
  once: true,
  execute: async (client) => {
    console.log(`🟢 Bot listo: ${client.user.tag}`);
    
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
    const commands = client.commands.map(cmd => cmd.data.toJSON());

    try {
      console.log('🔁 Actualizando comandos slash...');
      await rest.put(
        Routes.applicationCommands(client.user.id),
        { body: commands }
      );
      console.log('✅ Comandos slash actualizados');
    } catch (error) {
      console.error('❌ Error al actualizar comandos:', error);
    }
  }
};