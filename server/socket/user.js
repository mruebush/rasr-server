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

methods.login = function(user) {

  Player.findOneAsync({
    username: user
  }).then(function(result) {

    users[user] = {
      room: result.mapId,
      png: result.png,
      speed: result.speed,
      xp: +result.xp,
      level: +result.level,
      x: result.x,
      y: result.y
    };

    console.log('loaded ', users[user]);

  });
};

methods.logout = function(data) {
  var user = data.user;

  if (methods.exist(user)) {

    var userData = methods.get(user);
    var room = userData.room;
    methods.save(user, userData);
    methods.delete(user);

    emitToRoom(room, 'leave', {
      user: user
    });
    
  }
};

methods.gameOver = function(username, data) {
  var user = methods.get(username);
  user.xp *= 0.2;
  methods.save(username, data);
};

methods.resetAll = function(username) {
  var user = methods.get(username);
  user.xp = 0;
  user.level = 1;
};

methods.awardXp = function(username, xp) {
  var message;
  var levelUp;
  var user = methods.get(username);
  user.xp += xp;

  if (user.xp >= methods.xpToLevel(user.level)) {

    user.level++;
    user.xp = 0;
    methods.save(username, user);
    levelUp = true;
  } 

  return levelUp;
};

methods.extend = function(username, properties) {
  var user = methods.get(username);
  properties = properties || {};

  for (var key in user) {
    user[key] = properties[key];
  }
};

methods.freeXp = function(username, xp) {
    var user = methods.get(username);
    user.xp += xp;

    console.log("Awarded " + xp + " free xp to " + username);

    var message = user + ' was awarded ' + data.xp + ' free xp';

    if (user.xp >= methods.xpToLevel(user.level)) {
      user.level++;
      user.xp = 0;
      message = username + ' reached level ' + user.level; 
    }

    return message;
};

methods.xpToLevel = function(level) {
  return Math.floor(Math.exp(0.5 * level));
};

module.exports.methods = methods;