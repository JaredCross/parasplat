var GameOver = function(game){};


GameOver.prototype = {

    create: function(){
      this.game.stage.backgroundColor = '479cde';

        if (!p1Alive.alive && !p2Alive.alive) {
          gameOverMsg = me.game.add.text(600, 600, 'Everybody Lose!', style);
          newGameButton=game.add.button(450, 200, 'button', newGame);
          gameoverMsg.fixToCamera = true;
          newGameButton.fixToCamera = true;
        } else if (!p1Alive.alive && p2Alive.alive) {
          if (playerNumber === 2) {
            gameOverMsg = me.game.add.text(600, 600, 'You win!', style);
            newGameButton=game.add.button(450, 200, 'button', newGame);
            gameoverMsg.fixToCamera = true;
            newGameButton.fixToCamera = true;
          } else {
            gameOverMsg = me.game.add.text(600, 600, 'You lost =(', style);
            newGameButton=game.add.button(450, 200, 'button', newGame);
            gameoverMsg.fixToCamera = true;
            newGameButton.fixToCamera = true;
          }

        } else if (p1Alive.alive && !p2Alive.alive) {
            if (playerNumber === 1) {
              gameOverMsg = me.game.add.text(600, 600, 'You win!', style);
              newGameButton=game.add.button(450, 200, 'button', newGame);
              gameoverMsg.fixToCamera = true;
              newGameButton.fixToCamera = true;
            } else {
              gameOverMsg = me.game.add.text(600, 600, 'You lost =(', style);
              newGameButton=game.add.button(450, 200, 'button', newGame);
              gameOverMsg.fixToCamera = true;
              newGameButton.fixToCamera = true;
            }
        } else if (p1Alive.alive && p2Alive.alive) {
            gameOverMsg = me.game.add.text(600, 600, 'Everybody Win!', style);
            newGameButton=game.add.button(450, 200, 'button', newGame);
            gameoverMsg.fixToCamera = true;
            newGameButton.fixToCamera = true;

        }



    },

    restartGame: function(){
        this.game.state.start("GameTitle");
    }

};
