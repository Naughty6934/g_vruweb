'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Faculty Schema
 */
var FacultySchema = new Schema({
  Fac_Id: {
    type: String,
     Major:[{
       Mar_Id : {
         type: String,
         unique:'Cou_Id already exists'
       },
       Mar_Name : {
         type: String,
        required: 'Please fill in a Mar_Name'
       }
     }],
    unique: true,
    required: 'Please fill Faculty Id'
  },
  Fac_Name: {
    type: String,
    default: '',
    required: 'Please fill Faculty name'
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

mongoose.model('Faculty', FacultySchema);
