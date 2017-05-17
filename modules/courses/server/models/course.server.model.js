'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Course Schema
 */
var CourseSchema = new Schema({
  Cou_Id: {
    type: String,
     unique: true,
    default: '',
    required: 'Please fill Course Id',
    trim: true
  },
  Cou_Name: {
    type: String,
    default: '',
    required: 'Please fill Course name',
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

mongoose.model('Course', CourseSchema);
