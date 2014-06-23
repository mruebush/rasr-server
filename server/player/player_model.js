'use strict'

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Player Schema
 */

var PlayerSchema = new Schema({
  userId: {type: Schema.ObjectId, ref: 'Screen'},
  username: String,
  x: {type: Number, min: 0, max: 800, default: 250},
  y: {type: Number, min: 0, max: 800, default: 250},
  png: {type: String, default: 'roshan'} ,
  mapId: {type: Schema.ObjectId, ref: 'Screen'}
});

module.exports = mongoose.model('Player', PlayerSchema);
