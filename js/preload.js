var Preload = function(game){};

Preload.prototype = {

    preload: function(){
      this.game.load.image('player', 'assets/player.png');
      this.game.load.image('parachute', 'assets/parachute.png');
    },

    create: function(){
        this.game.state.start("Main");
    }
};
