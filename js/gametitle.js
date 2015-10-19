var GameTitle = function(game){};

GameTitle.prototype = {

    create: function(){
      var style = { font: "32px Arial", fill: "#ffffff", wordWrap: true, wordWrapWidth: 100, align: "center" };
      gameTitle = game.add.text(450, 100, 'Parasplat!', style);
      gameReady = game.add.text(this.game.world.centerX, this.game.world.centerY, 'Game is Ready!', style);

      var button = game.add.button(450, 200, 'button', actionOnClick);

      function actionOnClick() {
          this.game.state.start("Main");
      }
    },


    // startGame: function(){
    //     this.game.state.start("Main");
    // }

};
