module.exports = {};

module.exports.level = function(level) {
  return Math.floor(Math.exp(0.5 * level));
};

module.exports.speed = function(level) {
  return Math.floor(10 * Math.log(level));
};
