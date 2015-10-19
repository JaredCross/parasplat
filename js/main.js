var Main = function(game){

};

Main.prototype = {

  createGround: function () {

    var floor = this;

    floor.ground = floor.game.add.sprite(0, game.world.height - 40, 'ground');
    floor.ground.scale.setTo(11,1);
    floor.game.physics.arcade.enable(floor.ground);
    floor.ground.body.immovable = true;
  },

  createPlayer2: function () {
    var me = this;

    //Add the player to the game by creating a new sprite
    me.player2 = me.game.add.sprite(900, 100, 'players', 'alienPink_duck');

    //Set the players anchor point to be in the middle horizontally
    me.player2.anchor.setTo(0.5, 0.5);

    //Enable physics on the player
    me.game.physics.arcade.enable(me.player2);

    //Make the player fall by applying gravity
    me.player2.body.gravity.y = 100;

    //set physics body size
    me.player2.body.setSize(128, 358);

    //Make the player collide with the game boundaries
    me.player2.body.collideWorldBounds = true;


    me.player2.body.immovable = false;
  },

  createPlayer1: function(){

    var me = this;

    //Add the player to the game by creating a new sprite
    me.player1 = me.game.add.sprite(300, 100, 'players', 'alienGreen_duck');

    //Set the players anchor point to be in the middle horizontally
    me.player1.anchor.setTo(0.5, 0.5);

    //Enable physics on the player
    me.game.physics.arcade.enable(me.player1);

    //Make the player fall by applying gravity
    me.player1.body.gravity.y = 100;

    //set physics body size
    me.player1.body.setSize(128, 358);

    //Make the player collide with the game boundaries
    me.player1.body.collideWorldBounds = true;

    me.player1.body.immovable = false;

  },

    create: function() {
      // var cloud1 = game.add.sprite(550, 200, 'cloud', 'cloud1');

       var me = this;

       //Enable cursor keys so we can create some controls
       me.cursors = me.game.input.keyboard.createCursorKeys();

      //Set the initial score
      me.speedometer = 0;

      //Set the background colour to blue
      me.game.stage.backgroundColor = '479cde';

      //Enable the Arcade physics system
      me.game.physics.startSystem(Phaser.Physics.ARCADE);

      //add ground
      me.createGround();


      //Add the players to the screen
        me.createPlayer1();
        me.createPlayer2();


      game.camera.follow(me.player1);


        me.player1.animations.add('falling1', Phaser.Animation.generateFrameNames('alienGreen_walk', 1, 2), 5, true);
        me.player1.animations.play('falling1');

        me.player2.animations.add('falling2', Phaser.Animation.generateFrameNames('alienPink_walk', 1, 2), 5, true);
        me.player2.animations.play('falling2');



      var style = { font: "32px Arial", fill: "#ff0044", wordWrap: true, wordWrapWidth: 100, align: "center" };

      speedDisplay = game.add.text(50, 50, me.speedometer, style);
      speedDisplay.fixedToCamera = true;

      //receive info from the server about the other player
      // socket.on('p1InfoUpdate', function (data) {
      //   console.log(data + ' for 1');
      //   // me.player1.x = data.x;
      //   me.player1.y = data.y;
      // });

      // socket.on('p2InfoUpdate', function (data) {
      //   console.log(data + ' for 2');
      //   // me.player2.x = data.x;
      //   me.player2.y = data.y;
      // });

    },

    update: function() {
      var me = this;

      this.game.physics.arcade.collide(me.player, me.ground, function () {
        if (playerNumber === 1) {
          me.player1.frameName = 'alienGreen_duck';
        } else {
          me.player2.frameName = 'alienPink_duck';
        }

      });

      //send player info to the server for relaying to the other player
      if (playerNumber === 1) {
        socket.emit('p1Info', {x : me.player1.x, y : me.player1.y});
      } else if (playerNumber ===2) {
        socket.emit('p2Info', {x : me.player2.x, y : me.player2.y});
      }


      //Make the sprite jump when the up key is pushed
      if(me.cursors.up.isDown) {
          me.player1.body.velocity.y -= 10;
      }
      if(me.cursors.left.isDown) {
        me.player1.body.velocity.x -= 5;
      }
      if(me.cursors.right.isDown) {
        me.player1.body.velocity.x += 5;
      }

      if(me.player1.body.velocity.y > 0) {
        speedDisplay.text = 'Speed ' + Math.round(me.player1.body.speed);
     } else {
       speedDisplay.text = 'Speed ' + '0';
     }

    },


    gameOver: function(){
        this.game.state.start('GameOver');
    },



};
