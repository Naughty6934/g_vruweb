'use strict';

/**
 * Module dependencies
 */
var professorsPolicy = require('../policies/professors.server.policy'),
  professors = require('../controllers/professors.server.controller');

module.exports = function(app) {
  // Professors Routes
  app.route('/api/professors').all(professorsPolicy.isAllowed)
    .get(professors.list)
    .post(professors.create);

  app.route('/api/professors/:professorId').all(professorsPolicy.isAllowed)
    .get(professors.read)
    .put(professors.update)
    .delete(professors.delete);

  // Finish by binding the Professor middleware
  app.param('professorId', professors.professorByID);
};
