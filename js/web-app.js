var game = false;


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
          if(data.data.email) {
            console.log(data.data);
            $rootScope.loggedIn = true;
            $rootScope.user = data;
          } else {
            $rootScope.loggedIn = false;
          }
        });
  });
});

app.factory('Auth', function(){
var user;

return{

   isLoggedIn : function(data){
       if (data.data.email) {
         user = true;
         return user;
       } else {
         user = false;
         return user;
       }
   }
 };
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
      game.destroy();
      socket.emit('leaveGameLobby');
      socket.emit('leaveGameRoom');
    }
  };

});



//CONTROLLERS
app.controller('UsersController', function ($scope, Parasplat) {


  var socket = io();
  socket.on('clients', function (clients) {
    $scope.$apply(function () {
      $scope.users = clients.length + ' users online';
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
  // $scope.$route = $route;
  // $scope.$location = $location;
  // $scope.$routeParams = $routeParams;
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
      });
});
