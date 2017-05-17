'use strict';

/**
 * Module dependencies
 */
var facultiesPolicy = require('../policies/faculties.server.policy'),
  faculties = require('../controllers/faculties.server.controller');

module.exports = function(app) {
  // Faculties Routes
  app.route('/api/faculties').all(facultiesPolicy.isAllowed)
    .get(faculties.list)
    .post(faculties.create);

  app.route('/api/faculties/:facultyId').all(facultiesPolicy.isAllowed)
    .get(faculties.read)
    .put(faculties.update)
    .delete(faculties.delete);

  // Finish by binding the Faculty middleware
  app.param('facultyId', faculties.facultyByID);
};
