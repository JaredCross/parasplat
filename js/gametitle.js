var GameTitle = function(game){};



GameTitle.prototype = {

    create: function(){
      var start = this;
      var style = { font: "32px Arial", fill: "#ffffff", wordWrap: true, wordWrapWidth: 500, align: "center" };
      gameTitle = game.add.text(500, 200, 'Parasplat!', style);
      gameReady = game.add.text(400, 300, 'Game is Ready! Press Start', style);

      var button = game.add.button(530, 400, 'button', actionOnClick);

      function actionOnClick() {
        socket.emit('pressedStart');
        button.destroy();
        gameReady.text = 'Waiting for other player';
      }

      socket.on('receivedReady', function (data) {
          start.game.state.start("Main");
      });
    },

};
