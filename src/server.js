'use strict';

// 3rd Party Resources
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Esoteric Resources
const errorHandler = require('./middleware/error-handlers/500');
const notFound = require('./middleware/error-handlers/404');
const logger = require('./middleware/logger');
const v1Routes = require('./routes/v1');
const v2Routes = require('./routes/v2');
const authRouter = require('./auth/router');

// Prepare the express app
const app = express();

// App Level MW
app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logger);

// Routes
app.use(authRouter);

app.use('/api/v1', v1Routes); // http://localhost:3000/api/v1/clothes
app.use('/api/v2', v2Routes); // http://localhost:3000/api/v2/clothes

// Catchalls
app.use(notFound);
app.use(errorHandler);

module.exports = {
  server: app,
  start: (port) => {
    app.listen(port, () => {
      console.log(`Server Up on ${port}`);
    });
  },
};
