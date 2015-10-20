var GameOver = function(game){};


GameOver.prototype = {

    create: function(){
      var me = this;
      this.game.stage.backgroundColor = '479cde';

        if (!p1Alive.alive && !p2Alive.alive) {
          gameOverMsg = me.game.add.text(500, 150, 'Everybody Lose!', style);
          newGameButton=game.add.button(450, 400, 'button', newGame);
          gameoverMsg.fixToCamera = true;
          newGameButton.fixToCamera = true;
        } else if (!p1Alive.alive && p2Alive.alive) {
          if (playerNumber === 2) {
            gameOverMsg = me.game.add.text(500, 150, 'You win!', style);
            newGameButton=game.add.button(450, 400, 'button', newGame);
            gameoverMsg.fixToCamera = true;
            newGameButton.fixToCamera = true;
          } else {
            gameOverMsg = me.game.add.text(500, 150, 'You lost =(', style);
            newGameButton=game.add.button(450, 400, 'button', newGame);
            gameoverMsg.fixToCamera = true;
            newGameButton.fixToCamera = true;
          }

        } else if (p1Alive.alive && !p2Alive.alive) {
            if (playerNumber === 1) {
              gameOverMsg = me.game.add.text(500, 150, 'You win!', style);
              newGameButton=game.add.button(450, 400, 'button', newGame);
              gameoverMsg.fixToCamera = true;
              newGameButton.fixToCamera = true;
            } else {
              gameOverMsg = me.game.add.text(500, 150, 'You lost =(', style);
              newGameButton=game.add.button(450, 400, 'button', newGame);
              gameOverMsg.fixToCamera = true;
              newGameButton.fixToCamera = true;
            }
        } else if (p1Alive.alive && p2Alive.alive) {
            gameOverMsg = me.game.add.text(500, 150, 'Everybody Win!', style);
            newGameButton=game.add.button(450, 400, 'button', newGame);
            gameoverMsg.fixToCamera = true;
            newGameButton.fixToCamera = true;

        }



    },

    restartGame: function(){
        this.game.state.start("GameTitle");
    }

};
