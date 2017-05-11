'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Score = mongoose.model('Score'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Score
 */
exports.create = function(req, res) {
  var score = new Score(req.body);
  score.user = req.user;

  score.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(score);
    }
  });
};

/**
 * Show the current Score
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var score = req.score ? req.score.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  score.isCurrentUserOwner = req.user && score.user && score.user._id.toString() === req.user._id.toString();

  res.jsonp(score);
};

/**
 * Update a Score
 */
exports.update = function(req, res) {
  var score = req.score;

  score = _.extend(score, req.body);

  score.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(score);
    }
  });
};

/**
 * Delete an Score
 */
exports.delete = function(req, res) {
  var score = req.score;

  score.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(score);
    }
  });
};

/**
 * List of Scores
 */
exports.list = function(req, res) {
  Score.find().sort('-created').populate('user', 'displayName').exec(function(err, scores) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(scores);
    }
  });
};

/**
 * Score middleware
 */
exports.scoreByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Score is invalid'
    });
  }

  Score.findById(id).populate('user', 'displayName').exec(function (err, score) {
    if (err) {
      return next(err);
    } else if (!score) {
      return res.status(404).send({
        message: 'No Score with that identifier has been found'
      });
    }
    req.score = score;
    next();
  });
};
