var GameTitle = function(game){};



GameTitle.prototype = {

    create: function(){
      var start = this;
      var style = { font: "32px Arial", fill: "#ffffff", wordWrap: false, wordWrapWidth: 500, align: "center" };
      gameTitle = game.add.text(500, 100, 'Parasplat!', style);
      var instructions = game.add.text(490, 200, 'Instructions:', style);
      var instructions1 = game.add.text(280, 250, "Press the SPACE BAR to open your parachute", style);
      var instructions2 = game.add.text(230, 300, "BUT don't open it before your opponent does, or you lose", style);
      gameReady = game.add.text(400, 425, 'Game is Ready! Press Start', style);

      var button = game.add.button(530, 450, 'button', actionOnClick);

      function actionOnClick() {
        socket.emit('pressedStart');
        button.destroy();
        gameReady.x=350;
        gameReady.text = 'Waiting for other player to press start';
      }

      socket.on('receivedReady', function (data) {
          start.game.state.start("Main");
      });
    },

};
