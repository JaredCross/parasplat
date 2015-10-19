var Main = function(game){

};

Main.prototype = {

  createGround: function () {
    this.ground = this.game.add.sprite(-10 ,game.world.height - 25, 'ground');
    this.ground.scale.setTo(11,1);
    this.game.physics.arcade.enable(this.ground);
    // this.ground.enableBody = true;
    this.ground.body.immovable = true;
    this.ground.body.setSize(600,600);
  },

  createPlayer2: function () {
    var me = this;

    //Add the player to the game by creating a new sprite
    me.player = me.game.add.sprite(me.game.world.centerX, me.game.world.centerY, 'players', 'alienPink_duck');

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

  createPlayer1: function(){

    var me = this;

    //Add the player to the game by creating a new sprite
    me.player = me.game.add.sprite(me.game.world.centerX / 2, 100, 'players', 'alienGreen_duck');

    //Set the players anchor point to be in the middle horizontally
    me.player.anchor.setTo(0.5, 0.5);

    //Enable physics on the player
    me.game.physics.arcade.enable(me.player);

    //Make the player fall by applying gravity
    me.player.body.gravity.y = 100;

    //set physics body size
    me.player.body.setSize(128, 358);

    //Make the player collide with the game boundaries
    me.player.body.collideWorldBounds = true;

    //This means the players velocity will be unaffected by collisions
    me.player.body.immovable = true;

  },

    create: function() {
      var cloud1 = game.add.sprite(550, 200, 'cloud', 'cloud1');

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

      //add ground
      this.createGround()


      //Add the player to the screen
      me.createPlayer1();

      game.camera.follow(me.player);

      me.player.animations.add('falling', Phaser.Animation.generateFrameNames('alienGreen_walk', 1, 2), 5, true);
      me.player.animations.play('falling');

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
