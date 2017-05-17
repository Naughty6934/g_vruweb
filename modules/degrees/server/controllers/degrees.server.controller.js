'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Degree = mongoose.model('Degree'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Degree
 */
exports.create = function(req, res) {
  var degree = new Degree(req.body);
  degree.user = req.user;

  degree.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(degree);
    }
  });
};

/**
 * Show the current Degree
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var degree = req.degree ? req.degree.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  degree.isCurrentUserOwner = req.user && degree.user && degree.user._id.toString() === req.user._id.toString();

  res.jsonp(degree);
};

/**
 * Update a Degree
 */
exports.update = function(req, res) {
  var degree = req.degree;

  degree = _.extend(degree, req.body);

  degree.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(degree);
    }
  });
};

/**
 * Delete an Degree
 */
exports.delete = function(req, res) {
  var degree = req.degree;

  degree.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(degree);
    }
  });
};

/**
 * List of Degrees
 */
exports.list = function(req, res) {
  Degree.find().sort('-created').populate('user', 'displayName').exec(function(err, degrees) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(degrees);
    }
  });
};

/**
 * Degree middleware
 */
exports.degreeByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Degree is invalid'
    });
  }

  Degree.findById(id).populate('user', 'displayName').exec(function (err, degree) {
    if (err) {
      return next(err);
    } else if (!degree) {
      return res.status(404).send({
        message: 'No Degree with that identifier has been found'
      });
    }
    req.degree = degree;
    next();
  });
};
