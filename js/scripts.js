var game = false;

var userData;

var app = angular.module('parasplat', ['ngRoute', 'ngAnimate']);

app.factory('loginService', function ($http, $location) {
  return {
    isLogged: function () {
      var $check = $http.post('/checkstatus');
      return $check;
    }
  };
});

app.run(function ($rootScope, $location, loginService) {

  $rootScope.$on('$routeChangeStart', function (e, current) {

        var connected = loginService.isLogged();
        connected.then(function (data) {
          console.log(data);
          if(data.data.displayName) {
            $rootScope.loggedIn = true;
            $rootScope.user = data.data;
          } else {
            $rootScope.loggedIn = false;
          }
        });
  });
});


app.factory('Parasplat', function () {

  return {
    startGame : function () {
      //Create a new game that fills the screen
      game = new Phaser.Game(1200, 600, Phaser.AUTO, 'pleasework');

      //Add all states
      game.state.add("Boot", Boot);
      game.state.add("Preload", Preload);
      game.state.add("GameTitle", GameTitle);
      game.state.add("Main", Main);
      game.state.add("GameOver", GameOver);

      //Start the first state
      game.state.start("Boot");

      socket.emit('joinGameLobby', {user : 'me'});

      var lfg = setInterval(function () {
        socket.emit('lookingForGame');
      }, 3000);


      socket.on('leaveLFG', function () {
        clearInterval(lfg);
      });

    },


    destroyGame : function () {
      socket.emit('leaveGameLobby');
      socket.emit('leaveGameRoom');
      game.destroy();
    }
  };

});



//CONTROLLERS
app.controller('UsersController', function ($scope, Parasplat) {


  var socket = io();
  socket.on('clients', function (clients) {
    $scope.$apply(function () {
      if (clients.length === 1) {
        $scope.users = clients.length + ' user online';
      } else {
        $scope.users = clients.length + ' users online';
      }
    });
  });

  $scope.startGame = function () {
    Parasplat.startGame();
  };

  $scope.endGame = function () {
    Parasplat.destroyGame();
  };

});


app.controller('ApplicationController', function ($scope, $route, $routeParams, $location, $http, Parasplat) {
  if (game) {
    Parasplat.destroyGame();
    game = false;
  }

  if ($scope.user) {
    $http.post("/getdata")
      .success(function (data) {
          $scope.user.data = data;
          userData = $scope.user.data;
          console.log($scope.user.data);
      });
  }

});

//config section

app.config(function($routeProvider, $locationProvider){
  $routeProvider.when("/",
    {
      templateUrl: "/partials/home.html",
      controller: "ApplicationController",
      controllerAs: "app",
    }).when("/parasplat",
      {
        templateUrl:"/partials/game.html",
        controller:"ApplicationController",
        controllerAs: "app"
      }).when("/user",
        {
          templateUrl:"/partials/user.html",
          controller:"ApplicationController",
          controllerAs: "app"
        });
});

 // boot.js

 var socket = io();

 var Boot = function(game){

 };

 Boot.prototype = {

     preload: function(){

     },

     create: function(){
         // this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
         this.game.world.setBounds(0, 0, 1200, 2000);
         this.game.stage.disableVisibilityChange = true;
         this.game.state.start("Preload");
     }
 };

 // preload.js

 var Preload = function(game){};

 //to use with determining which player # client will be
 var playerNumber;

 Preload.prototype = {

     preload: function(){
       this.game.load.image('sky', 'assets/sky.png');
       this.game.load.image('ground', 'assets/grass.png');
       this.game.load.atlasXML('players', 'assets/player_characters.png', 'assets/player_characters.xml');
       this.game.load.atlasXML('octopus', 'assets/octopus.png', 'assets/octopus.xml');
       this.game.load.image('button', 'assets/gameicons/PNG/White/2x/buttonStart.png');
       this.game.load.atlasXML('backgroundImgs', 'assets/kenney-backgroundelements/Spritesheet/bgElements_spritesheet.png', 'assets/kenney-backgroundelements/Spritesheet/bgElements_spritesheet.xml');
     },

     create: function(){
       var newGame = this;
       var octopus = game.add.sprite(500,150,'octopus');
       octopus.animations.add('swim');
       octopus.animations.play('swim', 30, true);

       game.add.tween(octopus).to({ y: 200 }, 2000, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true);

       var style = { font: "32px Arial", fill: "#ffffff", wordWrap: false, wordWrapWidth: 300, align: "center" };
       waitingForMatch = game.add.text(450, 400, 'Looking for a match', style);

         var waiting = setInterval(function () {
         waitingForMatch.text += '.';
         if (waitingForMatch.text.length > 30) {
           waitingForMatch.text = 'Looking for a match.';
         }
         }, 2000);

       socket.on('player1', function () {
         playerNumber = 1;
       });

       socket.on('player2', function () {
         playerNumber = 2;
       });

       socket.on('gameReady', function () {
         clearInterval(waiting);
         newGame.game.state.start("GameTitle");
       });

     },

     update: function () {

     }

 };

 //gametitle.js

 var GameTitle = function(game){};



 GameTitle.prototype = {

     create: function(){
       var start = this;
       var style = { font: "32px Arial", fill: "#ffffff", wordWrap: true, wordWrapWidth: 100, align: "center" };
       gameTitle = game.add.text(450, 100, 'Parasplat!', style);
       gameReady = game.add.text(this.game.world.centerX, this.game.world.centerY, 'Game is Ready!', style);

       var button = game.add.button(450, 200, 'button', actionOnClick);

       function actionOnClick() {
         socket.emit('pressedStart');
       }

       socket.on('receivedReady', function (data) {
           start.game.state.start("Main");
       });
     },

 };

 //main.js

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
 var p1Alive = {};
 var p2Alive = {};
 var style = { font: "32px Arial", fill: "#ff0044", wordWrap: true, wordWrapWidth: 100, align: "center" };

 var newGameButton;
 var gameOverMsg;

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
     me.player2 = me.game.add.sprite(900, 100, 'players', 'alienPink_walk1');

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
     me.player1 = me.game.add.sprite(300, 100, 'players', 'alienGreen_walk1');

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
         p1Alive.ready = true;
         p1Alive.alive = data.alive;
         p1Alive.finalTime = data.finalTime;
         // if (playerNumber === 2) {
         if (data.alive === false) {
           me.player1.frameName = 'alienGreen_climb1';
         }
           if (data.alive) {
             me.player1.animations.stop();
             me.player1.frameName = 'alienGreen_duck';
             timer1.text = data.finalTime;
           } else {
             me.player1.animations.stop();
             me.player1.frameName = 'alienGreen_climb1';
             timer1.text = data.finalTime;
           }
         // }
       });

       socket.on('p2GroundUpdate', function (data) {
         p2Alive.ready = true;
         p2Alive.alive = data.alive;
         p2Alive.finalTime = data.finalTime;
         // if (playerNumber === 1) {
           if (data.alive) {
             me.player2.animations.stop();
             me.player2.frameName = 'alienPink_duck';
             timer2.text = data.finalTime;
           } else {
             me.player2.animations.stop();
             me.player2.frameName = 'alienPink_climb1';
             timer2.text = data.finalTime;
           }
         // }
       });

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
         playerDisplayB = game.add.text(950, 50, 'You!', style);
         playerDisplayB.fixedToCamera = true;
       }

     },



     update: function() {
       var me = this;

       //gameover
       if(p1Alive.ready && p2Alive.ready) {
         this.game.state.start('GameOver');
       }


       if (p1Alive.ready) {
         if (p1Alive.alive) {
           me.player1.frameName = 'alienGreen_duck';
         } else {
           me.player1.frameName = 'alienGreen_climb1';
         }
       }

       if (p2Alive.ready) {
         if (p2Alive.alive) {
           me.player2.frameName = 'alienPink_duck';
         } else {
           me.player2.frameName = 'alienPink_climb1';
         }
       }

       //timer
       if (!stopTimer) {
         updateTimer();
       }


       if (playerNumber === 1) {


         this.game.physics.arcade.collide(me.player1, me.ground, function () {
             stopTimer = true;
             if (me.player1.body.gravity.y != 30 && !gameOver1) {
                 finalTime = timer1.text;
                 me.player1.frameName = 'alienGreen_climb1';
                 if (!gameOver1) {
                   socket.emit('p1Ground', {finalTime : finalTime, alive : 'false'});
                   gameOver1 = true;
                 }
             } else if (!gameOver1) {
                 finalTime = timer1.text;
                 me.player1.frameName = 'alienGreen_duck';
                 if (!gameOver1) {
                   socket.emit('p1Ground', {finalTime: finalTime, alive : 'true'});
                   gameOver1 = true;
                 }

             }
         });
       }

       if (playerNumber === 2) {

         this.game.physics.arcade.collide(me.player2, me.ground, function () {

           stopTimer = true;
           if (me.player2.body.gravity.y != 30 && !gameOver2) {
               finalTime = timer2.text;
               me.player2.frameName = 'alienPink_climb1';
               if (!gameOver2) {
                 socket.emit('p2Ground', {finalTime : finalTime, alive : false});
                 gameOver2 = true;
               }
           } else if (!gameOver2) {
               finalTime = timer2.text;
               me.player2.frameName = 'alienPink_duck';
               if (!gameOver2) {
                 socket.emit('p2Ground', {finalTime: finalTime, alive : true});
                 gameOver2 = true;
               }
            }
         });
       }

       //parachute deployment
       if (me.parachuteButton.isDown) {
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

 function newGame() {
   window.location.reload();
 }

 // gameover.js

 var GameOver = function(game){};


 GameOver.prototype = {

     create: function(){

       if (userData) {
         console.log(userData);
         socket.emit('playedGame', userData);
       }
       var me = this;
       this.game.stage.backgroundColor = '479cde';

         if (!p1Alive.alive && !p2Alive.alive) {
           gameOverMsg = me.game.add.text(500, 150, 'Everybody Lose!', style);
           newGameButton=game.add.button(500, 400, 'button', newGame);
           gameOverMsg.fixToCamera = true;
           newGameButton.fixToCamera = true;
         } else if (!p1Alive.alive && p2Alive.alive) {
           if (playerNumber === 2) {
             gameOverMsg = me.game.add.text(500, 150, 'You win!', style);
             newGameButton=game.add.button(500, 400, 'button', newGame);
             gameOverMsg.fixToCamera = true;
             newGameButton.fixToCamera = true;
           } else {
             gameOverMsg = me.game.add.text(500, 150, 'You lost =(', style);
             newGameButton=game.add.button(500, 400, 'button', newGame);
             gameOverMsg.fixToCamera = true;
             newGameButton.fixToCamera = true;
           }

         } else if (p1Alive.alive && !p2Alive.alive) {
             if (playerNumber === 1) {
               gameOverMsg = me.game.add.text(500, 150, 'You win!', style);
               newGameButton=game.add.button(500, 400, 'button', newGame);
               gameOverMsg.fixToCamera = true;
               newGameButton.fixToCamera = true;
             } else {
               gameOverMsg = me.game.add.text(500, 150, 'You lost =(', style);
               newGameButton=game.add.button(500, 400, 'button', newGame);
               gameOverMsg.fixToCamera = true;
               newGameButton.fixToCamera = true;
             }
         } else if (p1Alive.alive && p2Alive.alive) {
             gameOverMsg = me.game.add.text(500, 150, 'Everybody Win!', style);
             newGameButton=game.add.button(500, 400, 'button', newGame);
             gameOverMsg.fixToCamera = true;
             newGameButton.fixToCamera = true;

         }



     },

     restartGame: function(){
         this.game.state.start("GameTitle");
     }

 };
