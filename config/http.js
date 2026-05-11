/**
 * HTTP Server Settings (config/http.js)
 * Явна роздача static з assets/, бо без grunt pipeline файли не копіюються в .tmp/public.
 */

const path = require('path');
const express = require('express');

module.exports.http = {
  middleware: {
    order: [
      'cookieParser',
      'session',
      'bodyParser',
      'compress',
      'poweredBy',
      'serveAssets',
      'router',
      'www',
      'favicon',
    ],

    serveAssets: express.static(path.join(__dirname, '..', 'assets')),
  },
};
