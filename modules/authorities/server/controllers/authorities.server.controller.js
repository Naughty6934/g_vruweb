'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Authority = mongoose.model('Authority'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Authority
 */
exports.create = function(req, res) {
  var authority = new Authority(req.body);
  authority.user = req.user;

  authority.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(authority);
    }
  });
};

/**
 * Show the current Authority
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var authority = req.authority ? req.authority.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  authority.isCurrentUserOwner = req.user && authority.user && authority.user._id.toString() === req.user._id.toString();

  res.jsonp(authority);
};

/**
 * Update a Authority
 */
exports.update = function(req, res) {
  var authority = req.authority;

  authority = _.extend(authority, req.body);

  authority.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(authority);
    }
  });
};

/**
 * Delete an Authority
 */
exports.delete = function(req, res) {
  var authority = req.authority;

  authority.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(authority);
    }
  });
};

/**
 * List of Authorities
 */
exports.list = function(req, res) {
  Authority.find().sort('-created').populate('user', 'displayName').exec(function(err, authorities) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(authorities);
    }
  });
};

/**
 * Authority middleware
 */
exports.authorityByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Authority is invalid'
    });
  }

  Authority.findById(id).populate('user', 'displayName').exec(function (err, authority) {
    if (err) {
      return next(err);
    } else if (!authority) {
      return res.status(404).send({
        message: 'No Authority with that identifier has been found'
      });
    }
    req.authority = authority;
    next();
  });
};
