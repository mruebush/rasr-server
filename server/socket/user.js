var Promise = require('bluebird');

var users = {};
var methods = {};

// sample users object:
// { user1: { room: 'name of room', x: xCoord, y: yCoord, xp:, level:}, user2: {...}, ...}
// var users = {};

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
  Player.findOneAndUpdateAsync({ username: username }, {
    x: data.x,
    y: data.y,
    mapId: data.room,
    level: data.level,
    health: data.health,
    xp: data.xp
  })
};

methods.login = function(user) {

  return Player.findOneAsync({
    username: user
  }).then(function(result) {
    users[user] = {
      username: result.username,
      room: result.mapId,
      // png: result.png,
      // speed: result.speed,
      xp: +result.xp,
      level: +result.level,
      health: +result.health,
      x: result.x,
      y: result.y
    };

    return new Promise(function (onResolved, onRejected) {
      onResolved(users[user]);
    });

  });
};

methods.logout = function(data) {
  var user = data.user;

  if (methods.exist(user)) {

    var userData = methods.get(user);
    var room = userData.room;
    methods.save(user, userData);
    methods.delete(user); 
  }
};

methods.gameOver = function(username, data) {
  var user = methods.get(username);
  user.xp *= 0.2;
  methods.save(username, data);
};

methods.setPosition = function(username, position) {
  var user = methods.get(username);

  if (user) {
    user.x = position[0];
    user.y = position[1];
    return true;
  }
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
  user.levelUp = false;
  if (user) {
    user.xp += xp;

    if (user.xp >= methods.xpToLevel(user.level)) {
      user.level++;
      user.xp = 0;
      user.levelUp = true;
    }

    methods.save(username, user);
  }
  return user;
};

methods.level = function(username) {
  var user = methods.get(username);

  if (user) {
    return user.level;
  }
};

methods.getXp = function(username) {
  var user = methods.get(username);
  console.log('getting xp', user);

  if (user) {
    return user.xp;
  }
};

methods.extend = function(username, properties) {
  var user = methods.get(username);
  properties = properties || {};

  if (!user) {
    methods.login(username)
    .then(function(user) {
      for (var key in properties) {
        user[key] = properties[key];
      }
    })
  } else {
    for (var key in properties) {
      user[key] = properties[key];
    }
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

methods.userXpToLevel = function(username) {
  var user = methods.get(username);

  if (user) {
    return methods.xpToLevel(user.level);
  }
};

methods.xpToLevel = function(level) {
  return Math.floor(Math.exp(0.5 * level));
};

module.exports.methods = methods;