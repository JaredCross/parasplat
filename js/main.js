var Main = function(game){

};


var timer1;
var timer2;
var milliseconds = 0;
var seconds = 0;
var minutes = 0;
var timeNow;
var stopTimer= false;
var finalTime;
var gameOver1 = false;
var gameOver2 = false;

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
    if (playerNumber === 1) {
      me.player2.body.gravity.y = 0;
    } else {
      me.player2.body.gravity.y = 100;
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
    me.player1 = me.game.add.sprite(300, 100, 'players', 'alienGreen_duck');

    //Set the players anchor point to be in the middle horizontally
    me.player1.anchor.setTo(0.5, 0.5);

    //Enable physics on the player
    me.game.physics.arcade.enable(me.player1);

    //Make the player fall by applying gravity
    if (playerNumber === 2) {
      me.player1.body.gravity.y = 0;
    } else {
      me.player1.body.gravity.y = 100;
    }

    //set physics body size
    me.player1.body.setSize(128, 358);

    //Make the player collide with the game boundaries
    me.player1.body.collideWorldBounds = true;

    me.player1.body.immovable = false;

  },

    create: function() {
      //timer
      var style = { font: "32px Arial", fill: "#ff0044", wordWrap: true, wordWrapWidth: 100, align: "center" };
      timer1 = game.add.text(100, 50, '00:00:00', style);
      timer1.fixedToCamera = true;

      timeNow = game.time.time;

      timer2 = game.add.text(800, 50, '00:00:00', style);
      timer2.fixedToCamera = true;

       var me = this;

       //Enable cursor keys so we can create some controls space for parachute
       me.cursors = me.game.input.keyboard.createCursorKeys();
       this.parachuteButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);


      //Set the background colour to blue
      me.game.stage.backgroundColor = '479cde';

      //Enable the Arcade physics system
      me.game.physics.startSystem(Phaser.Physics.ARCADE);

      //add ground
      me.createGround();


      //Add the players to the screen
        me.createPlayer1();
        me.createPlayer2();

        if (playerNumber === 1) {
          game.camera.follow(me.player1);
        } else {
          game.camera.follow(me.player2);
        }



        me.player1.animations.add('falling1', Phaser.Animation.generateFrameNames('alienGreen_walk', 1, 2), 5, true);
        me.player1.animations.play('falling1');

        me.player2.animations.add('falling2', Phaser.Animation.generateFrameNames('alienPink_walk', 1, 2), 5, true);
        me.player2.animations.play('falling2');





      // receive info from the server about the other player
      socket.on('p1InfoUpdate', function (data) {
        if (playerNumber === 2) {
          me.player1.x = data.x;
          me.player1.y = data.y;
          timer1.setText(data.timer);
        }
      });

      socket.on('p2InfoUpdate', function (data) {
        if (playerNumber === 1) {
          me.player2.x = data.x;
          me.player2.y = data.y;
          timer2.setText(data.timer);
        }
      });

      socket.on('p1ParachuteUpdate', function () {
        if (playerNumber === 2) {
          me.player1.animations.stop();
          me.player1.frameName = 'alienGreen_parachute';
        }
      });

      socket.on('p2ParachuteUpdate', function () {
        if (playerNumber === 1) {
          me.player2.animations.stop();
          me.player2.frameName = 'alienPink_parachute';
        }
      });

      socket.on('p1GroundUpdate', function (data) {
        gameOver1 = true;
        if (playerNumber === 2) {
          if (data.alive) {
            me.player1.animations.stop();
            me.player1.frameName = 'alienGreen_duck';
          } else {
            me.player1.animations.stop();
            me.player1.frameName = 'alienGreen_climb1';
          }
        }
      });

      socket.on('p2GroundUpdate', function (data) {
        gameOver2 = true;
        if (playerNumber === 1) {
          if (data.alive) {
            me.player2.animations.stop();
            me.player2.frameName = 'alienPink_duck';
          } else {
            me.player2.animations.stop();
            me.player2.frameName = 'alienPink_climb1';
          }
        }
      });

      var playerDisplayA;
      var playerDisplayB;

      if (playerNumber === 1) {
        playerDisplayA = game.add.text(300, 50, 'You!', style);
        playerDisplayA.fixedToCamera = true;
        playerDisplayB = game.add.text(800, 50, 'Them!', style);
        playerDisplayB.fixedToCamera = true;
      } else {
        playerDisplayA = game.add.text(300, 50, 'Them!', style);
        playerDisplayA.fixedToCamera = true;
        playerDisplayB = game.add.text(800, 50, 'You!', style);
        playerDisplayB.fixedToCamera = true;
      }

    },



    update: function() {
      var me = this;


      //timer
      if (!stopTimer) {
        updateTimer();
      }



      this.game.physics.arcade.collide(me.player1, me.ground, function () {
          stopTimer = true;
          if (playerNumber === 1 && me.player1.gravity.y != 30) {
              finalTime = timer1.text;
              me.player1.frameName = 'alienGreen_climb1';
              socket.emit('p1Ground', {finalTime : finalTime, alive : 'false'});
          } else if (playerNumber === 1 && me.player1.framName === 'alienGreen_parachute') {
              finalTime = timer1.text;
              me.player1.frameName = 'alienGreen_duck';
              socket.emit('p1Ground', {finalTime: finalTime, alive : 'true'});
          }
      });

      this.game.physics.arcade.collide(me.player2, me.ground, function () {
        stopTimer = true;
        if (playerNumber === 2 && me.player2.gravity != 30) {
            finalTime = timer2.text;
            me.player2.frameName = 'alienPink_climb1';
            socket.emit('p2Ground', {finalTime : finalTime, alive : 'false'});
        } else if (playerNumber === 2){
            finalTime = timer2.text;
            me.player2.frameName = 'alienPink_duck';
            socket.emit('p2Ground', {finalTime: finalTime, alive : 'true'});
        }
      });

      //parachute deployment
      if (me.parachuteButton.onDown) {
        if (playerNumber === 1) {
          me.player1.body.gravity.y = 30;
          me.player1.animations.stop();
          me.player1.frameName = 'alienGreen_parachute';
          socket.emit('p1Parachute');
        } else if (playerNumber === 2){
          me.player2.body.gravity.y = 30;
          me.player2.animations.stop();
          me.player2.frameName = 'alienPink_parachute';
          socket.emit('p2Parachute');
        }
      }


      //send player info to the server for relaying to the other player
        if (playerNumber === 1) {
          socket.emit('p1Info', {x : me.player1.x, y : me.player1.y, timer: timer1.text});
        } else if (playerNumber === 2) {
          socket.emit('p2Info', {x : me.player2.x, y : me.player2.y, timer : timer2.text});
        }
      //
      // //Movement and Parachute
      // if(me.cursors.up.isDown) {
      //     me.player1.body.velocity.y -= 10;
      // }
      // if(me.cursors.left.isDown) {
      //   me.player1.body.velocity.x -= 5;
      // }
      // if(me.cursors.right.isDown) {
      //   me.player1.body.velocity.x += 5;
      // }




    },


    gameOver: function(){
        this.game.state.start('GameOver');
    },



};

function updateTimer() {


    minutes = Math.floor((game.time.time - timeNow) / 60000) % 60;

    seconds = Math.floor((game.time.time - timeNow) / 1000) % 60;

    milliseconds = Math.floor(game.time.time - timeNow) % 100;

    //If any of the digits becomes a single digit number, pad it with a zero
    if (milliseconds < 10)
        milliseconds = '0' + milliseconds;

    if (seconds < 10)
        seconds = '0' + seconds;

    if (minutes < 10)
        minutes = '0' + minutes;

        if (playerNumber === 1) {
          timer1.setText('Stopwatch: ' + minutes + ':'+ seconds + ':' + milliseconds);
        } else {
          timer2.setText('Stopwatch: ' + minutes + ':'+ seconds + ':' + milliseconds);
        }


}
