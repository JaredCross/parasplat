var Preload = function(game){};

Preload.prototype = {

    preload: function(){
      this.game.load.image('sky', 'assets/sky.png');
      this.game.load.image('ground', 'assets/grass.png');
      this.game.load.atlasXML('players', 'assets/player_characters.png', 'assets/player_characters.xml');
      this.game.load.atlasXML('octopus', 'assets/octopus.png', 'assets/octopus.xml');
      this.game.load.image('button', 'assets/gameicons/PNG/White/2x/buttonStart.png');
      this.game.load.atlasXML('backgroundImgs', 'assets/kenney-backgroundelements/Spritesheet/bgElements_spritesheet.png', 'assets/kenney-backgroundelements/Spritesheet/bgElements_spritesheet.xml');
    },

    create: function(){
      var newGame = this;
      var octopus = game.add.sprite(500,150,'octopus');
      octopus.animations.add('swim');
      octopus.animations.play('swim', 30, true);

      game.add.tween(octopus).to({ y: 200 }, 2000, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true);

      var style = { font: "32px Arial", fill: "#ffffff", wordWrap: false, wordWrapWidth: 300, align: "center" };
      waitingForMatch = game.add.text(450, 400, 'Looking for a match', style);

        var waiting = setInterval(function () {
        waitingForMatch.text += '.';
        if (waitingForMatch.text.length > 30) {
          waitingForMatch.text = 'Looking for a match.';
        }
        }, 2000);

      socket.on('gameReady', function () {
        clearInterval(waiting);
        newGame.game.state.start("GameTitle");
      });

    },

    update: function () {

    }

};
