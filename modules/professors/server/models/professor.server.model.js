'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Professor Schema
 */
var ProfessorSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Professor name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Professor', ProfessorSchema);
