var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Screen Schema
 */

var ScreenSchema = new Schema({
  height: {type: Number, default: 24},
  width: {type: Number, default: 32},
  layers: Array,
  enemies: Object,
  orientation: {type: String, default: 'orthogonal'},
  properties: Object,
  tileheight: {type: Number, default: 40},
  tilewidth: {type: Number, default: 40},
  tilesets: [Schema.Types.Mixed],
  version: {type: Number, default: 1},
  upScreen: {type: Schema.ObjectId, ref: 'Screen'},
  rightScreen: {type: Schema.ObjectId, ref: 'Screen'},
  downScreen: {type: Schema.ObjectId, ref: 'Screen'},
  leftScreen: {type: Schema.ObjectId, ref: 'Screen'},
});

module.exports = mongoose.model('Screen', ScreenSchema);
