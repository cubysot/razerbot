const express = require('express');
const app = express();

let botActivo = true;

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Estado del Bot</title>
        <style>
            body {
                margin: 0;
                height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: #f0f0f0;
            }
            
            .boton-estado {
                padding: 20px 40px;
                font-size: 24px;
                border: none;
                border-radius: 50px;
                cursor: pointer;
                position: relative;
                transition: all 0.3s ease;
            }
            
            .activo {
                background-color: #4CAF50;
                animation: pulso 2s infinite;
            }
            
            .inactivo {
                background-color: #ff6666;
            }
            
            @keyframes pulso {
                0% {
                    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
                }
                
                70% {
                    box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
                }
                
                100% {
                    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
                }
            }
        </style>
    </head>
    <body>
        <button id="estadoBot" class="boton-estado">Bot Status</button>

        <script>
            async function actualizarEstado() {
                try {
                    const respuesta = await fetch('/status');
                    const datos = await respuesta.json();
                    const boton = document.getElementById('estadoBot');
                    
                    if(datos.activo) {
                        boton.classList.remove('inactivo');
                        boton.classList.add('activo');
                        boton.textContent = 'Bot Activo';
                    } else {
                        boton.classList.remove('activo');
                        boton.classList.add('inactivo');
                        boton.textContent = 'Bot Inactivo';
                    }
                } catch(error) {
                    console.error('Error al obtener estado:', error);
                    boton.classList.add('inactivo');
                    boton.textContent = 'Error de conexión';
                }
            }

            // Actualizar cada segundo
            setInterval(actualizarEstado, 1000);
            actualizarEstado(); // Verificación inicial
        </script>
    </body>
    </html>
  `);
});

app.get('/status', (req, res) => {
  res.json({ activo: botActivo });
});

// Simulador de cambio de estado cada 5 segundos
setInterval(() => {
  botActivo = !botActivo;
}, 5000);

app.listen(3000, () => console.log('Servidor corriendo en puerto 3000'));