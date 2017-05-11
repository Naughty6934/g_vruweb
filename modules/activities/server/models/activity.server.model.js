'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Activity Schema
 */
var ActivitySchema = new Schema({
id: {
    type: String,
    default: '',
    required: 'Please fill Activity id',
    trim: true
  },
name: {
    type: String,
    default: '',
    required: 'Please fill Activity name',
    trim: true
  },


  type: {
    type: [{
      type: String,
      enum: ['คุณธรรมจริยธรรม', 'ความรู้', 'ทักษะทางปัญญา', 'ทักษะวิเคราะห์เชิงตัวเลข การสื่อสารและการใช้เทคโนโลยีสารสนเทศ']
    }],
    default: ['user'],
    required: 'Please provide at least one type'
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

mongoose.model('Activity', ActivitySchema);
