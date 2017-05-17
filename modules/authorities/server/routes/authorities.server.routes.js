'use strict';

/**
 * Module dependencies
 */
var authoritiesPolicy = require('../policies/authorities.server.policy'),
  authorities = require('../controllers/authorities.server.controller');

module.exports = function(app) {
  // Authorities Routes
  app.route('/api/authorities').all(authoritiesPolicy.isAllowed)
    .get(authorities.list)
    .post(authorities.create);

  app.route('/api/authorities/:authorityId').all(authoritiesPolicy.isAllowed)
    .get(authorities.read)
    .put(authorities.update)
    .delete(authorities.delete);

  // Finish by binding the Authority middleware
  app.param('authorityId', authorities.authorityByID);
};
