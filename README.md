# RASR - A HTML5, multiplayer, tilebased game

RASR is a cooperative multiplayer game where players can build diverse maps or explore the world and fight creatures. 

We wanted to create an environment where players could express themselves through the art of map editing, while being able to explore and see what other users have created. This was also a good opportunity to integrate a wide range of technologies, from sophisticated frameworks such as Angular and Phaser.io, to cutting edge real-time engines like Socket.io

Players can explore the world, fight creatures, gain rewards, interact with other players and their surroundings.
They also have the possibility to build and customize the world.

Using the arrow keys, the player is able to move through their surroundings and fight enemies by shooting fireballs with the space bar. Also, by clicking on the Earth icon in the bottom-left corner, the player can edit or create new maps.

## Getting Started

Our deployed version is up and running at: [http://rasr.azurewebsites.net](http://rasr.azurewebsites.net)

Or if you prefer to run it locally, simply clone the [rasr](https://github.com/rising-thunder/rasr) and rasr-server repository and install the dependencies with bower and npm

### Prerequisites

You need git to clone the rasr & rasr-server repository. You can get it from
[http://git-scm.com/](http://git-scm.com/).

We also use a number of node.js tools to initialize and test rasr. You must have node.js and
its package manager (npm) installed.  You can get them from [http://nodejs.org/](http://nodejs.org/).

### Clone rasr

Clone the rasr repository using [git][git]:

```
git clone https://github.com/rising-thunder/rasr-server.git
cd rasr-server
```

### Install Dependencies

* We get the tools we depend upon via `npm`, the [node package manager][npm].

### Run the Application

We have preconfigured the project with a simple development web server.  The simplest way to start
this server is:

```
node server.js
```

## Contact

For more information on RASR please check out http://rasr.azurewebsites.net/about

[git]: http://git-scm.com/
[bower]: http://bower.io
[npm]: https://www.npmjs.org/
[node]: http://nodejs.org
[express]: http://expressjs.com/
[mongoDB]: http://www.mongodb.org/
[mongoose]: http://mongoosejs.com/
[socket.io]: http://socket.io/
[http-server]: https://github.com/nodeapps/http-server
