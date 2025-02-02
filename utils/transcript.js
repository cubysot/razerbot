const fs = require('fs');

async function generateHTMLTranscript(channel) {
  const messages = await channel.messages.fetch({ limit: 100 });

  const styles = `
    <link rel="stylesheet" href="https://razerbot.vercel.app/src/style.css">
    <link rel="stylesheet" href="https://razerbot.vercel.app/src/base.css">
  `;

  const scripts = `
    <script src="https://razerbot.vercel.app/src/main.js"></script>
  `;

  const generateAttachmentHTML = (att) => {
    if (att.contentType?.startsWith('image/')) {
      return `<img src="${att.url}" class="attachment-image">`;
    } else if (att.contentType?.startsWith('video/')) {
      return `
        <video controls class="attachment-video">
          <source src="${att.url}" type="${att.contentType}">
          Tu navegador no soporta la reproducción de video.
        </video>`;
    } else if (att.contentType?.startsWith('audio/')) {
      return `
        <audio controls class="attachment-audio">
          <source src="${att.url}" type="${att.contentType}">
          Tu navegador no soporta la reproducción de audio.
        </audio>`;
    } else {
      return `<a href="${att.url}" download="${att.name}" class="download-link">Descargar archivo: ${att.name}</a>`;
    }
  };

  const generateMessageHTML = (msg) => `
    <div class="message">
      <img src="${msg.author.displayAvatarURL({ size: 512 })}" class="avatar">
      <div class="content">
        <div class="user-info">
          ${msg.author.username}
          <span class="timestamp">${msg.createdAt.toLocaleString()}</span>
        </div>
        ${msg.content ? `<div class="message-text">${msg.content}</div>` : ''}
        ${msg.attachments.size > 0 ? `
          <div class="attachments">
            ${[...msg.attachments.values()].map(generateAttachmentHTML).join('')}
          </div>` : ''}
        ${msg.embeds.map(embed => `
          <div class="embed">
            ${embed.title ? `<div class="embed-title">${embed.title}</div>` : ''}
            ${embed.description ? `<div class="embed-description">${embed.description}</div>` : ''}
            ${embed.image ? `<img src="${embed.image.url}" class="embed-image">` : ''}
          </div>`).join('')}
      </div>
    </div>
  `;

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RazerCraft</title>
    ${styles}
</head>
<body>
    <!-- Panel de servidores -->
    <div class="server-panel">
        <!-- Servidor en carga con ícono SVG (se mostrará en blanco y cambiará a azul en hover) -->
        <div class="server-item server-loading">
            <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="none" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19.73 4.87a18.2 18.2 0 0 0-4.6-1.44c-.21.4-.4.8-.58 1.21-1.69-.25-3.4-.25-5.1 0-.18-.41-.37-.82-.59-1.2-1.6.27-3.14.75-4.6 1.43A19.04 19.04 0 0 0 .96 17.7a18.43 18.43 0 0 0 5.63 2.87c.46-.62.86-1.28 1.2-1.98-.65-.25-1.29-.55-1.9-.92.17-.12.32-.24.47-.37 3.58 1.7 7.7 1.7 11.28 0l.46.37c-.6.36-1.25.67-1.9.92.35.7.75 1.35 1.2 1.98 2.03-.63 3.94-1.6 5.64-2.87.47-4.87-.78-9.09-3.3-12.83ZM8.3 15.12c-1.1 0-2-1.02-2-2.27 0-1.24.88-2.26 2-2.26s2.02 1.02 2 2.26c0 1.25-.89 2.27-2 2.27Zm7.4 0c-1.1 0-2-1.02-2-2.27 0-1.24.88-2.26 2-2.26s2.02 1.02 2 2.26c0 1.25-.88 2.27-2 2.27Z"></path>
            </svg>
        </div>
        <div class="separador"></div>
        <!-- Servidor RazerCraft (ya cargado) -->
        <div class="server-item">
            <img src="https://cdn.discordapp.com/icons/1226406024207011900/e65b7617f303623d64f952c903775be0.webp" alt="RazerCraft" class="server-avatar">
        </div>
        <!-- Otro servidor en carga con iniciales -->
        ${Array(5).fill('<div class="server-item server-loading"><span class="server-initial"></span></div>').join('')}
    </div>

    <!-- Panel de canales -->
    <div class="channel-panel">
        <div class="channel-header-cont">
            <div class="channel-header-container">
                <div class="booster">
                    <img src="https://discordresources.com/img/server/CommunityBoosted.svg" alt="Imagen no disponible" class="booster-icon">
                </div>
                <div class="channel-header">RazerCraft</div>
            </div>
        </div>
        <div class="channel-list">
            <!-- Canal activo (no en carga) -->
            <div class="channel-item active">
                <span>#ticket-0001</span>
            </div>
            <!-- Canales en carga (efecto skeleton) -->
            ${['#general', '#soporte', '#registros'].map(channel => `
              <div class="channel-item channel-loading">
                <span>${channel}</span>
              </div>`).join('')}
        </div>

        <!-- Panel de usuario -->
        <div class="user-panel">
            <div class="user-avatar-container">
                <img src="${messages.first().author.displayAvatarURL({ size: 512 })}" class="user-avatar">
                <span class="user-status">${messages.first().author.username}</span>
            </div>
            <span class="username"></span>
            <div class="user-controls">
                <!-- Botón de micrófono -->
                <button class="control-btn" title="Micrófono">
                    <img class="microfono" src="https://raw.githubusercontent.com/cubysot/razerbot/refs/heads/main/assets/microphone.svg" alt="Micrófono">
                </button>
                <!-- Botón de auriculares -->
                <button class="control-btn" title="Auriculares">
                    <img class="audifonos" src="https://raw.githubusercontent.com/cubysot/razerbot/refs/heads/main/assets/headphone.svg" alt="Auricolares">
                </button>
                <!-- Botón de ajustes -->
                <button class="control-btn" title="Ajustes">
                    <img class="ajustes" src="https://raw.githubusercontent.com/cubysot/razerbot/refs/heads/main/assets/settings.svg" alt="Ajustes">
                </button>
            </div>
        </div>
    </div>

    <!-- Área de transcripción (contenido de mensajes, por ejemplo) -->
    <div class="transcription-container">
        <div class="container">
            <h1>Transcripción de ${channel.name}</h1>
            ${messages.reverse().map(generateMessageHTML).join('')}
        </div>
    </div>

    ${scripts}
</body>
</html>
  `;

  const filename = `transcript-${channel.name}.html`;
  fs.writeFileSync(filename, html);
  return filename;
}

module.exports = { generateHTMLTranscript };