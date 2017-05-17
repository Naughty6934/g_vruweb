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
  Act_Id: {
    type: String,
    default: '',
    unique: true,
    required: 'Please fill Activity activity_id',
  },
  Act_Name: {
    type: String,
    default: '',
    required: 'Please fill Activity name',
  },
Act_Type: {
    type: [{
      type: String,
      enum: ['คุณธรรมจริยธรรม', 'ความรู้', 'ทักษะทางปัญญา', 'ทักษะวิเคราะห์เชิงตัวเลข การสื่อสารและการใช้เทคโนโลยีสารสนเทศ']
    }],
    default: ['user'],
    required: 'Please provide at least one type'
  },
  Act_Objective: {
    type: String,
    default: '',
    required: 'Please fill Activity Objective',
  },
  Act_DateStart: {
    type: Date,
    default: Date.now,
    required: 'Please fill Activity DateStart',
  },
  Act_DateEnd: {
    type: Date,
    default: null
  },
  Act_Location: {
    type: String,
    default: ''
  },
  Act_Condition: {
    type: String,
    default: ''
  },
  Act_Unit: {
    type: Number,
    default: ''
  },
  Act_file_Program: {
    type: String,
    default: ''
  },
  Act_file_Signature: {
    type: String,
    default: ''
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
