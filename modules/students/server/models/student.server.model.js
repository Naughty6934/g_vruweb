'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Student Schema
 */
var StudentSchema = new Schema({
  Stu_Id: {
    type: String,
    default: '',
    required: 'Please fill Student Id',
    trim: true
  },
  Stu_Name: {
    type: String,
    default: '',
    required: 'Please fill Student name',
    trim: true
  },
  Stu_Type:{
type:[{
  type: String,
      enum: ['หลักสูตร4ปี(ภาคปกติ)', 'หลักสูตร2ปี(ภาคพิเศษ)']
}],
default: ['หลักสูตร4ปี(ภาคปกติ)'],
    required: 'Please provide at least one role'
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

mongoose.model('Student', StudentSchema);
