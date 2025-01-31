const fs = require('fs');

async function generateHTMLTranscript(channel) {
  const messages = await channel.messages.fetch({ limit: 100 });
  
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Transcripción ${channel.name}</title>
    <style>
      /* Estilos base */
      body {
        background: #36393f;
        color: #dcddde;
        font-family: 'Whitney', sans-serif;
        padding: 20px;
        margin: 0;
      }

      /* Contenedor principal */
      .container {
        max-width: 800px;
        margin: 0 auto;
      }

      /* Estilos para cada mensaje */
      .message {
        display: flex;
        margin: 15px 0;
        padding: 15px;
        background: #2f3136;
        border-radius: 8px;
      }

      /* Avatar del usuario */
      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin-right: 15px;
        flex-shrink: 0;
      }

      /* Contenido del mensaje */
      .content {
        flex-grow: 1;
        min-width: 0;
      }

      /* Información del usuario */
      .user-info {
        color: #fff;
        font-weight: bold;
        margin-bottom: 5px;
      }

      .timestamp {
        color: #72767d;
        font-size: 0.8em;
        margin-left: 8px;
      }

      /* Texto del mensaje */
      .message-text {
        word-wrap: break-word;
        white-space: pre-wrap;
      }

      /* Contenedor de archivos adjuntos */
      .attachments {
        margin-top: 10px;
      }

      /* Estilos para imágenes */
      .attachment-image {
        max-width: 100%;
        border-radius: 5px;
        margin: 5px 0;
        cursor: pointer;
        transition: transform 0.2s;
      }

      .attachment-image:hover {
        transform: scale(1.02);
      }

      /* Estilos para videos */
      .attachment-video {
        max-width: 100%;
        border-radius: 5px;
        margin: 5px 0;
      }

      /* Estilos para audio */
      .attachment-audio {
        width: 100%;
        margin: 5px 0;
      }

      /* Estilos para embeds */
      .embed {
        background: #2f3136;
        border-left: 4px solid #202225;
        padding: 10px;
        margin: 5px 0;
        border-radius: 4px;
      }

      .embed-title {
        color: #fff;
        font-weight: bold;
        margin-bottom: 5px;
      }

      .embed-description {
        color: #dcddde;
      }

      .embed-image {
        max-width: 100%;
        border-radius: 5px;
        margin-top: 10px;
      }

      /* Estilos para enlaces de descarga */
      .download-link {
        color: #00aff4;
        text-decoration: none;
      }

      .download-link:hover {
        text-decoration: underline;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Transcripción de ${channel.name}</h1>
      ${messages.reverse().map(msg => `
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
            ${[...msg.attachments.values()].map(att => {
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
            }).join('')}
          </div>` : ''}
          ${msg.embeds.map(embed => `
          <div class="embed">
            ${embed.title ? `<div class="embed-title">${embed.title}</div>` : ''}
            ${embed.description ? `<div class="embed-description">${embed.description}</div>` : ''}
            ${embed.image ? `<img src="${embed.image.url}" class="embed-image">` : ''}
          </div>`).join('')}
        </div>
      </div>`).join('')}
    </div>
  </body>
  </html>`;

  const filename = `transcript-${channel.name}.html`;
  fs.writeFileSync(filename, html);
  return filename;
}

module.exports = { generateHTMLTranscript };