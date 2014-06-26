var users = {};
var methods = {};

methods.getAll = function() {
  return users;
};

methods.get = function(username) {
  return users[username];
};

methods.exist = function(username) {
  return !!methods.get(username);
};

module.exports.methods = methods;