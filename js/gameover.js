var GameOver = function(game){};


GameOver.prototype = {

  createGround: function () {

    var floor = this;

    floor.ground = floor.game.add.sprite(0, 560, 'ground');
    floor.ground.scale.setTo(11,1);
    floor.game.physics.arcade.enable(floor.ground);
    floor.ground.body.immovable = true;
  },
  createPlayer2: function () {
    var me = this;

    //Add the player to the game by creating a new sprite
    me.player2 = me.game.add.sprite(900, 390, 'players', 'alienPink_walk1');

    //Set the players anchor point to be in the middle horizontally
    me.player2.anchor.setTo(0.5, 0.5);

    //Enable physics on the player
    me.game.physics.arcade.enable(me.player2);

    //Make the player fall by applying gravity
    if (playerNumber === 1) {
      me.player2.body.gravity.y = 0;
    } else {
      me.player2.body.gravity.y = 0;
    }

    //set physics body size
    me.player2.body.setSize(128, 358);

    //Make the player collide with the game boundaries
    me.player2.body.collideWorldBounds = true;


    me.player2.body.immovable = false;
  },

  createPlayer1: function(){

    var me = this;

    //Add the player to the game by creating a new sprite
    me.player1 = me.game.add.sprite(300, 390, 'players', 'alienGreen_walk1');

    //Set the players anchor point to be in the middle horizontally
    me.player1.anchor.setTo(0.5, 0.5);

    //Enable physics on the player
    me.game.physics.arcade.enable(me.player1);

    //Make the player fall by applying gravity
    if (playerNumber === 2) {
      me.player1.body.gravity.y = 0;
    } else {
      me.player1.body.gravity.y = 0;
    }

    //set physics body size
    me.player1.body.setSize(128, 358);

    //Make the player collide with the game boundaries
    me.player1.body.collideWorldBounds = true;

    me.player1.body.immovable = false;

  },

    create: function(){
      var me = this;

      var playerDisplayA;
      var playerDisplayB;

      if (playerNumber === 1) {
        playerDisplayA = game.add.text(300, 50, 'You!', style);
        playerDisplayA.fixedToCamera = true;
        playerDisplayB = game.add.text(1000, 50, 'Them!', style);
        playerDisplayB.fixedToCamera = true;
      } else {
        playerDisplayA = game.add.text(300, 50, 'Them!', style);
        playerDisplayA.fixedToCamera = true;
        playerDisplayB = game.add.text(900, 50, 'You!', style);
        playerDisplayB.fixedToCamera = true;
      }


      me.createGround();

      game.add.text(100, 50, p1Alive.finalTime, style);

      game.add.text(700, 50, p2Alive.finalTime, style);




      if (userData) {
        console.log(userData);
        socket.emit('doneSendToDB', userData);
      }

      socket.on('okiedokie', function () {
        console.log(data);
      });

      this.game.stage.backgroundColor = '479cde';

        if (!p1Alive.alive && !p2Alive.alive) {
            gameOverMsg = me.game.add.text(500, 150, 'Everybody Lose!', style);
            newGameButton=game.add.button(500, 300, 'button', newGame);
            gameOverMsg.fixToCamera = true;
            newGameButton.fixToCamera = true;
            me.createPlayer1();
            me.player1.frameName = 'alienGreen_climb1';
            me.createPlayer2();
            me.player2.frameName = 'alienPink_climb1';
        } else if (!p1Alive.alive && p2Alive.alive) {
            me.createPlayer1();
            me.player1.frameName = 'alienGreen_climb1';
            me.createPlayer2();
            me.player2.frameName = 'alienPink_duck';
          if (playerNumber === 2) {
            gameOverMsg = me.game.add.text(500, 150, 'You win!', style);
            newGameButton=game.add.button(500, 300, 'button', newGame);
            gameOverMsg.fixToCamera = true;
            newGameButton.fixToCamera = true;
          } else {
            gameOverMsg = me.game.add.text(500, 150, 'You lost =(', style);
            newGameButton=game.add.button(500, 300, 'button', newGame);
            gameOverMsg.fixToCamera = true;
            newGameButton.fixToCamera = true;
          }

        } else if (p1Alive.alive && !p2Alive.alive) {
              me.createPlayer1();
              me.player1.frameName = 'alienGreen_duck';
              me.createPlayer2();
              me.player2.frameName = 'alienPink_climb1';
            if (playerNumber === 1) {
              gameOverMsg = me.game.add.text(500, 150, 'You win!', style);
              newGameButton=game.add.button(500, 300, 'button', newGame);
              gameOverMsg.fixToCamera = true;
              newGameButton.fixToCamera = true;
            } else {
              gameOverMsg = me.game.add.text(500, 150, 'You lost =(', style);
              newGameButton=game.add.button(500, 300, 'button', newGame);
              gameOverMsg.fixToCamera = true;
              newGameButton.fixToCamera = true;
            }
        } else if (p1Alive.alive && p2Alive.alive) {
            var p1FinalTime = Number(p1Alive.finalTime.substring(11));
            var p2FinalTime = Number(p2Alive.finalTime.substring(11));

            console.log(p1FinalTime);
            console.log(p2FinalTime);

            me.createPlayer1();
            me.player1.frameName = 'alienGreen_duck';
            me.createPlayer2();
            me.player2.frameName = 'alienPink_duck';
            // gameOverMsg = me.game.add.text(500, 150, 'Everybody Win!', style);
            // newGameButton=game.add.button(500, 400, 'button', newGame);
            // gameOverMsg.fixToCamera = true;
            // newGameButton.fixToCamera = true;
            if (p1FinalTime > p2FinalTime) {
              if (playerNumber === 1) {
                gameOverMsg = me.game.add.text(500, 150, 'You win!', style);
                newGameButton=game.add.button(500, 300, 'button', newGame);
                gameOverMsg.fixToCamera = true;
                newGameButton.fixToCamera = true;
              } else {
                gameOverMsg = me.game.add.text(500, 150, 'You lost =(', style);
                newGameButton=game.add.button(500, 300, 'button', newGame);
                gameOverMsg.fixToCamera = true;
                newGameButton.fixToCamera = true;
              }
            } else if (p1FinalTime < p2FinalTime){
              if (playerNumber === 2) {
                gameOverMsg = me.game.add.text(500, 150, 'You win!', style);
                newGameButton=game.add.button(500, 300, 'button', newGame);
                gameOverMsg.fixToCamera = true;
                newGameButton.fixToCamera = true;
              } else {
                gameOverMsg = me.game.add.text(500, 150, 'You lost =(', style);
                newGameButton=game.add.button(500, 300, 'button', newGame);
                gameOverMsg.fixToCamera = true;
                newGameButton.fixToCamera = true;
              }
            }

        }



    },

    restartGame: function(){
        this.game.state.start("GameTitle");
    },



};
