'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Authority Schema
 */
var AuthoritySchema = new Schema({


    Aut_Id: {
    type: String,
    default: '',
    unique:'Aut_Id already exists',
    required: 'Please fill Authority Id',
   
  },
  Aut_Name: {
    type: String,
    default: '',
    required: 'Please fill Authority name',
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

mongoose.model('Authority', AuthoritySchema);
