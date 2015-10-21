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
app.controller('UsersController', function ($http, $scope, Parasplat) {


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
          $scope.user = data;
          $scope.userData = data;
          userData = data;
      });
  }

});

app.controller('LogoutController', function ($scope, $route, $routeParams, $location, $http) {
  $http.get('/logout').success(function () {
    console.log('logged out');
  });
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
        }).when('/logout',
          {
            templateUrl:"",
            controller:"LogoutController",
            controllerAs: "app"
          });
});
