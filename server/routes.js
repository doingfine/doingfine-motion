/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function(app) {
  // Enable CORS header for all incoming requests
  app.use('/*',function(req,res,next){
      res.header({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'content-type, accept'
      });
      next();
  });

  // Insert routes below
  app.use('/api/users', require('./api/user'));
  app.use('/api/threads', require('./api/thread'));
  app.use('/api/photos', require('./api/photo'));

  app.use('/auth', require('./auth'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile('public/index.html');
    });
};
