var Preload = function(game){};

Preload.prototype = {

    preload: function(){
      this.game.load.image('player', 'assets/player.png');
      this.game.load.image('parachute', 'assets/parachute.png');
      this.game.load.atlasXML('octopus', 'assets/octopus.png', 'assets/octopus.xml');
    },

    create: function(){
      var newGame = this;
      var octopus = game.add.sprite(300,200,'octopus');
      octopus.animations.add('swim');
      octopus.animations.play('swim', 30, true);

      socket.on('gameReady', function () {
        console.log('working?');
        newGame.game.state.start("Main");
      });

    },

};
