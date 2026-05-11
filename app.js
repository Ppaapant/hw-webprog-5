/**
 * app.js
 *
 * Точка входу Sails.js застосунку.
 */

require('dotenv').config();

const sails = require('sails');
const rc = require('sails/accessible/rc');

sails.lift(rc('sails'), (err) => {
  if (err) {
    console.error('Не вдалося запустити Sails:', err);
    process.exit(1);
  }
});
