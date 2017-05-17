'use strict';

/**
 * Module dependencies
 */
var degreesPolicy = require('../policies/degrees.server.policy'),
  degrees = require('../controllers/degrees.server.controller');

module.exports = function(app) {
  // Degrees Routes
  app.route('/api/degrees').all(degreesPolicy.isAllowed)
    .get(degrees.list)
    .post(degrees.create);

  app.route('/api/degrees/:degreeId').all(degreesPolicy.isAllowed)
    .get(degrees.read)
    .put(degrees.update)
    .delete(degrees.delete);

  // Finish by binding the Degree middleware
  app.param('degreeId', degrees.degreeByID);
};
