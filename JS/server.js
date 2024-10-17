const express = require('express');
const cors = require('cors');
const { WebpayPlus } = require('transbank-sdk');
const path = require('path');

// Simulación de una base de datos con correos registrados
const usuariosRegistrados = ['usuario1@gmail.com', 'usuario2@gmail.com', 'test@test.com'];

// Configuración de Webpay en modo integración
WebpayPlus.configureForTesting(); // Solo para modo testing

const app = express();

// Middleware para manejar CORS y JSON
app.use(cors());
app.use(express.json());

console.log('Iniciando servidor...');

// Ruta GET para la raíz ("/")
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint para verificar si un correo está registrado
app.post('/registrar', (req, res) => {
  const { email } = req.body;
  console.log(`Verificando correo: ${email}`);
  if (usuariosRegistrados.includes(email)) {
    res.json({ registrado: true });
  } else {
    res.json({ registrado: false });
  }
});

// Ruta para iniciar una transacción con Webpay
app.post('/iniciar-pago', async (req, res) => {
  const { carritoTotal, buyOrder, sessionId } = req.body;

  try {
    const response = await WebpayPlus.Transaction.create(
      buyOrder,      // Orden de compra única (generada por ti)
      sessionId,     // ID de sesión del usuario (puede ser generado automáticamente)
      carritoTotal,  // Total a pagar
      'http://localhost:3000/confirmacion' // URL de retorno después del pago
    );

    res.json({
      url: response.url,
      token: response.token,
    });
  } catch (error) {
    console.error('Error al iniciar la transacción', error);
    res.status(500).send('Error al iniciar la transacción');
  }
});

// Ruta para confirmar la transacción de Webpay
app.post('/confirmacion', async (req, res) => {
  const { token_ws } = req.body;

  try {
    const response = await WebpayPlus.Transaction.commit(token_ws);
    res.json(response);
  } catch (error) {
    console.error('Error al confirmar la transacción', error);
    res.status(500).send('Error al confirmar la transacción');
  }
});

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
