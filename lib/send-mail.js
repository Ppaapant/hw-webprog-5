/**
 * Надсилання пошти через Brevo SMTP + Nodemailer.
 * https://www.brevo.com/ → Transactional → SMTP & API → генерувати SMTP key
 *
 * .env:
 *   BREVO_SMTP_LOGIN  — email вашого акаунта Brevo (логін у кабінет)
 *   BREVO_SMTP_KEY    — SMTP key (не пароль від сайту)
 *   MAIL_FROM         — підтверджена адреса відправника у Brevo (Senders)
 *   MAIL_TO           — куди приходять листи з форми (часто ваша ж пошта)
 */

const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com',
    port: Number(process.env.BREVO_SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.BREVO_SMTP_LOGIN,
      pass: process.env.BREVO_SMTP_KEY,
    },
  });

  return transporter;
}

module.exports = async function sendMail({ name, email, subject, message }) {
  const from = process.env.MAIL_FROM;
  const to = process.env.MAIL_TO;

  if (!process.env.BREVO_SMTP_LOGIN || !process.env.BREVO_SMTP_KEY || !from || !to) {
    throw new Error('Не налаштовано Brevo SMTP (BREVO_SMTP_LOGIN, BREVO_SMTP_KEY) або MAIL_FROM / MAIL_TO у .env');
  }

  const html = `
    <h2>Нове повідомлення з форми зворотного зв'язку</h2>
    <p><strong>Ім'я:</strong> ${escape(name)}</p>
    <p><strong>Email:</strong> ${escape(email)}</p>
    <p><strong>Тема:</strong> ${escape(subject)}</p>
    <p><strong>Повідомлення:</strong></p>
    <pre style="white-space: pre-wrap; font-family: inherit;">${escape(message)}</pre>
  `;

  const text = `Нове повідомлення з форми:

Ім'я: ${name}
Email: ${email}
Тема: ${subject}

Повідомлення:
${message}
`;

  const info = await getTransporter().sendMail({
    from,
    to,
    replyTo: email,
    subject: `[Contact] ${subject}`,
    text,
    html,
  });

  return info;
};

function escape(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
