var Promise = require('bluebird'),
    mongoose = require('mongoose'),
    Player = mongoose.model('Player');
    Screen = mongoose.model('Screen');

module.exports = {
  newPlayer: function(req, res) {

    var user = req.body.user;
    var png = req.body.png || 'roshan';

    Screen.findAsync()
    .then(function(screen) {
      var mapId = screen[0]._id;
      var player = new Player({
        username: user,
        mapId: mapId,
        png: png,
        x: 200,
        y: 200
      });

      player.save(function(error, user) {
        if (error) {
          console.log(error); 
        } else { 
          console.log(user);
        }
        res.send(200);
      });
    });
  },

  getPlayer: function(req, res) {
    console.log(req.cookies, req.user)
    if (req.user) {
      var name = req.user.name;
    } else {
      name = 'test';
    }
    return Player.findOneAsync({username: name})
    .then(function(foundPlayer) {
      console.log('found player', foundPlayer);
      if (foundPlayer) {
        // check to make sure player has valid mapId
        return Screen.findByIdAsync(foundPlayer.mapId)
        .then(function(foundScreen) {
          if (!foundScreen) {
            // update player with new mapId
            return Screen.findAsync()
            .then(function(screens) {
              var mapId = screens[0]._id;
              return Player.findOneAndUpdateAsync(
                {username: name}, 
                {mapId: mapId})
              .then(function(updatedPlayer) {
                console.log('updated!', updatedPlayer);
                res.send(updatedPlayer);
              })
              .catch(function(err) {
                handleError(err, res);
              })
            })
          } else {
            // player already has valid mapId
            res.send(foundPlayer);
          }
        })
      } else {
        // didn't find player...
        handleError(err, res);
      }
    })
    .catch(function(err) {
      handleError(err, res);
    });
  }
};