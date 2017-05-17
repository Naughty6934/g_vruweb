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
  Pro_Id: {
    type: String,
    default: '',
    unique:'Pro_Id already exists',
    required: 'Please fill Professor Id',
   
  },
  Pro_Name: {
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
