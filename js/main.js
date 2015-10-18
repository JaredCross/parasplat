var Main = function(game){

};

Main.prototype = {

  createPlayer2: function () {
    var me = this;

    //Add the player to the game by creating a new sprite
    me.player = me.game.add.sprite(me.game.world.centerX, me.game.world.centerY, 'player');

    //Set the players anchor point to be in the middle horizontally
    me.player.anchor.setTo(0.5, 0.5);

    //Enable physics on the player
    me.game.physics.arcade.enable(me.player);

    //Make the player fall by applying gravity
    me.player.body.gravity.y = 1;

    //Make the player collide with the game boundaries
    me.player.body.collideWorldBounds = true;

    //This means the players velocity will be unaffected by collisions
    me.player.body.immovable = true;
  },

  createPlayer: function(){

    var me = this;

    //Add the player to the game by creating a new sprite
    me.player = me.game.add.sprite(me.game.world.centerX / 2, me.game.world.centerY, 'player');

    //Set the players anchor point to be in the middle horizontally
    me.player.anchor.setTo(0.5, 0.5);

    //Enable physics on the player
    me.game.physics.arcade.enable(me.player);

    //Make the player fall by applying gravity
    me.player.body.gravity.y = 10;

    //Make the player collide with the game boundaries
    me.player.body.collideWorldBounds = true;

    //This means the players velocity will be unaffected by collisions
    me.player.body.immovable = true;

  },

    create: function() {

       var me = this;

       //Enable cursor keys so we can create some controls
       me.cursors = me.game.input.keyboard.createCursorKeys();

      //Set the initial score
      me.speedometer = 0;

      //Get the dimensions of the tile we are using
      me.tileWidth = me.game.cache.getImage('tile').width;
      me.tileHeight = me.game.cache.getImage('tile').height;

      //Set the background colour to blue
      me.game.stage.backgroundColor = '479cde';

      //Enable the Arcade physics system
      me.game.physics.startSystem(Phaser.Physics.ARCADE);

      //Add the player to the screen
      me.createPlayer();

      socket.on('clients', function (data) {
        console.log(data + ' from main.js');
        if (data.length > 1) {
          me.createPlayer2();
        } else {
          console.log('only one player');
        }

      });



      var style = { font: "32px Arial", fill: "#ff0044", wordWrap: true, wordWrapWidth: 100, align: "center" };

      speedDisplay = game.add.text(50, 50, me.speedometer, style);


    },

    update: function() {


      var me = this;


      //Make the sprite jump when the up key is pushed
      if(me.cursors.up.isDown) {
          me.player.body.velocity.y -= 10;
      }
      if(me.cursors.left.isDown) {
        me.player.body.velocity.x -= 5;
      }
      if(me.cursors.right.isDown) {
        me.player.body.velocity.x += 5;
      }

      if(me.player.body.velocity.y > 0) {
        speedDisplay.text = 'Speed ' + Math.round(me.player.body.speed);
     } else {
       speedDisplay.text = 'Speed ' + '0';
     }

    },


    gameOver: function(){
        this.game.state.start('GameOver');
    },


};
