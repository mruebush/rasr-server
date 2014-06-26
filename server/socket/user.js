var users = {};
var methods = {};

var Player = require('mongoose').model('Player');

methods.getAll = function() {
  return users;
};

methods.get = function(username) {
  return users[username];
};

methods.exist = function(username) {
  return !!methods.get(username);
};

methods.delete = function(username) {
  return delete users[username];
};

methods.others = function(username, room) {
  var res = [];
  var obj = {};

  for (var otherUser in users) {

    // users[otherUser].room is sometimes an object ! (dont know why)
    var fixed = JSON.stringify(users[otherUser].room).replace(/"/g,'');

    if (fixed === room && otherUser !== username) {
      
      obj = methods.get(otherUser);
      obj.user = otherUser;
      res.push(obj);
      
    }
  }

  return res;
};

methods.save = function(username, data) {
  Player.findOneAndUpdate({
    username: username
  }, {
    x: userData.x,
    y: userData.y,
    mapId: userData.room,
    level: userData.level,
      xp: userData.xp
  }, null, function(){
    console.log(arguments);
  });
};

module.exports.methods = methods;