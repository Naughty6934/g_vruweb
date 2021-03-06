'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Faculty = mongoose.model('Faculty'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Faculty
 */
exports.create = function(req, res) {
  var faculty = new Faculty(req.body);
  faculty.user = req.user;

  faculty.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(faculty);
    }
  });
};

/**
 * Show the current Faculty
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var faculty = req.faculty ? req.faculty.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  faculty.isCurrentUserOwner = req.user && faculty.user && faculty.user._id.toString() === req.user._id.toString();

  res.jsonp(faculty);
};

/**
 * Update a Faculty
 */
exports.update = function(req, res) {
  var faculty = req.faculty;

  faculty = _.extend(faculty, req.body);

  faculty.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(faculty);
    }
  });
};

/**
 * Delete an Faculty
 */
exports.delete = function(req, res) {
  var faculty = req.faculty;

  faculty.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(faculty);
    }
  });
};

/**
 * List of Faculties
 */
exports.list = function(req, res) {
  Faculty.find().sort('-created').populate('user', 'displayName').exec(function(err, faculties) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(faculties);
    }
  });
};

/**
 * Faculty middleware
 */
exports.facultyByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Faculty is invalid'
    });
  }

  Faculty.findById(id).populate('user', 'displayName').exec(function (err, faculty) {
    if (err) {
      return next(err);
    } else if (!faculty) {
      return res.status(404).send({
        message: 'No Faculty with that identifier has been found'
      });
    }
    req.faculty = faculty;
    next();
  });
};
