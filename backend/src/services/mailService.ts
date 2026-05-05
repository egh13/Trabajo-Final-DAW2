// Servicio de envío de correos electrónicos
// Utiliza nodemailer para enviar correos a través de SMTP

import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'

// Configuración del transportador de correo
const createTransporter = (): Transporter => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true para 465, false para otros puertos
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

// Función para enviar correo de bienvenida a nuevos usuarios
export const sendWelcomeEmail = async (to: string, userName: string): Promise<void> => {
  try {
    // Verificar si las credenciales SMTP están configuradas
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log(`📧 [SIMULACIÓN] Correo de bienvenida preparado para ${userName} <${to}>`)
      console.log('   Para activar el envío real, configura SMTP_USER y SMTP_PASS en .env')
      return
    }

    const transporter = createTransporter()

    const mailOptions = {
      from: `"SecureTenis" <${process.env.SMTP_USER}>`,
      to,
      subject: '¡Bienvenido a SecureTenis!',
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bienvenido a SecureTenis</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              background-color: #f4f4f4;
              text-align: center;
            }
            .container {
              background-color: #ffffff;
              margin: 20px;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              color: #2563eb;
              margin-bottom: 10px;
            }
            .welcome-message {
              font-size: 18px;
              color: #059669;
              margin-bottom: 20px;
            }
            .content {
              margin-bottom: 30px;
            }
            .features {
              background-color: #f8fafc;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .feature-item {
              margin-bottom: 10px;
              padding-left: 20px;
              position: relative;
            }
            .feature-item:before {
              content: "✓";
              color: #059669;
              font-weight: bold;
              position: absolute;
              left: 0;
            }
            .cta-button {
              display: inline-block;
              background-color: #2563eb;
              color: #000000;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: bold;
              margin: 20px 0;
            }

            .cta-button:visited {
                color: #000000 !important;
            }

            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              font-size: 14px;
              color: #6b7280;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">SecureTenis</div>
              <div class="welcome-message">¡Bienvenido a nuestra tienda, ${userName}!</div>
            </div>

            <div class="content">
              <p>Gracias por registrarte en <strong>SecureTenis</strong>. Estamos emocionados de tenerte como parte de nuestra comunidad de amantes del deporte.</p>

              <div class="features">
                <h3 style="margin-top: 0; color: #1f2937;">¿Qué puedes hacer ahora?</h3>
                <div class="feature-item">Explorar nuestro catálogo de productos deportivos</div>
                <div class="feature-item">Realizar compras de forma segura</div>
                <div class="feature-item">Acceder a ofertas exclusivas</div>
                <div class="feature-item">Gestionar tu carrito de compras</div>
                <div class="feature-item">Recibir actualizaciones sobre nuevos productos</div>
              </div>

              <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos. Nuestro equipo de soporte está aquí para ayudarte.</p>

              // Reemplaza el bloque del botón por este:

            <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}"
                    class="cta-button" 
                    style="display: inline-block; background-color: #2563eb; color: #000000; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0;">
                    <span style="color: #000000 !important; text-decoration: none;">¡Comienza a comprar!</span>
                </a>
            </div>
            </div>

            <div class="footer">
              <p>
                Este correo fue enviado automáticamente por SecureTenis.<br>
                Si no te registraste en nuestra plataforma, puedes ignorar este mensaje.
              </p>
              <p style="margin-top: 10px;">
                <small>&copy; 2026 SecureTenis. Todos los derechos reservados.</small>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Correo de bienvenida enviado:', info.messageId)
  } catch (error) {
    console.error('Error al enviar correo de bienvenida:', error)
    // No lanzamos el error para no interrumpir el flujo de registro
    // Solo lo logueamos para debugging
  }
}

// Función genérica para enviar correos (para futuras expansiones)
export const sendEmail = async (
  to: string,
  subject: string,
  html: string,
  text?: string
): Promise<void> => {
  try {
    const transporter = createTransporter()

    const mailOptions = {
      from: `"SecureTenis" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Correo enviado:', info.messageId)
  } catch (error) {
    console.error('Error al enviar correo:', error)
    throw error
  }
}