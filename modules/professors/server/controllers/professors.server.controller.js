'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Professor = mongoose.model('Professor'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Professor
 */
exports.create = function(req, res) {
  var professor = new Professor(req.body);
  professor.user = req.user;

  professor.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(professor);
    }
  });
};

/**
 * Show the current Professor
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var professor = req.professor ? req.professor.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  professor.isCurrentUserOwner = req.user && professor.user && professor.user._id.toString() === req.user._id.toString();

  res.jsonp(professor);
};

/**
 * Update a Professor
 */
exports.update = function(req, res) {
  var professor = req.professor;

  professor = _.extend(professor, req.body);

  professor.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(professor);
    }
  });
};

/**
 * Delete an Professor
 */
exports.delete = function(req, res) {
  var professor = req.professor;

  professor.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(professor);
    }
  });
};

/**
 * List of Professors
 */
exports.list = function(req, res) {
  Professor.find().sort('-created').populate('user', 'displayName').exec(function(err, professors) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(professors);
    }
  });
};

/**
 * Professor middleware
 */
exports.professorByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Professor is invalid'
    });
  }

  Professor.findById(id).populate('user', 'displayName').exec(function (err, professor) {
    if (err) {
      return next(err);
    } else if (!professor) {
      return res.status(404).send({
        message: 'No Professor with that identifier has been found'
      });
    }
    req.professor = professor;
    next();
  });
};
