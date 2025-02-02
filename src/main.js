document.addEventListener('DOMContentLoaded', () => {
    // Manejo de canales: al hacer click se remueve la clase "active" de los demás y se marca el canal seleccionado
    document.querySelectorAll('.channel-item').forEach(item => {
      item.addEventListener('click', () => {
        document.querySelectorAll('.channel-item').forEach(channel => {
          channel.classList.remove('active');
        });
        item.classList.add('active');
  
        // Si el canal estaba en carga, se remueve esa clase para simular que se terminó la carga
        if (item.classList.contains('channel-loading')) {
          item.classList.remove('channel-loading');
          item.style.pointerEvents = 'auto';
        }
      });
    });
  
    // Simular carga inicial de servidores (quitamos la clase "server-loading" después de 2 segundos)
    setTimeout(() => {
      document.querySelectorAll('.server-loading').forEach(server => {
        server.classList.remove('server-loading');
      });
    }, 2000);
  });
  