/**
 * POST /api/contact
 * Приймає дані форми зворотного зв'язку, валідує їх
 * та надсилає email власнику сайту через Brevo SMTP (Nodemailer).
 */

module.exports = {
  friendlyName: 'Contact',
  description: 'Send feedback message via Brevo SMTP.',

  inputs: {
    name: {
      type: 'string',
      required: true,
      minLength: 2,
      maxLength: 100,
    },
    email: {
      type: 'string',
      required: true,
      isEmail: true,
      maxLength: 200,
    },
    subject: {
      type: 'string',
      required: true,
      minLength: 2,
      maxLength: 200,
    },
    message: {
      type: 'string',
      required: true,
      minLength: 5,
      maxLength: 5000,
    },
  },

  exits: {
    success: {
      description: 'Mail sent successfully.',
    },
    invalid: {
      responseType: 'badRequest',
      description: 'Invalid form data.',
    },
    emailFailed: {
      statusCode: 502,
      description: 'Failed to send email.',
    },
  },

  fn: async function (inputs, exits) {
    const sendMail = require('../../lib/send-mail');

    try {
      await sendMail({
        name: inputs.name,
        email: inputs.email,
        subject: inputs.subject,
        message: inputs.message,
      });
    } catch (e) {
      sails.log.error('Email send failed:', e);
      return exits.emailFailed({ error: 'mail_send_failed', detail: e.message });
    }

    return exits.success({ ok: true, message: 'Лист успішно надіслано' });
  },
};
