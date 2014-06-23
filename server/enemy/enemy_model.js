var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EnemySchema = new Schema({
  name: {type: String, unique: true},
  png: String,
  speed: {type: Number, default: 200},
  health: Number
});

module.exports = mongoose.model('Enemy', EnemySchema);
