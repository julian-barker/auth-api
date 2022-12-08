'use strict';

require('dotenv').config();
const app = require('./src/server');
const { db } = require('./src/models');
// const { db: authDB } = require('./src/auth/models');

(async () => {
  // await authDB.sync();
  await db.sync();
  app.start(process.env.PORT || 3001);
})();
