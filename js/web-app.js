var app = angular.module('parasplat', ['ngRoute', 'ngAnimate', 'parasplat.services']);

var game = false;

//controller section

app.controller('UsersController', function ($scope, Parasplat) {
  var socket = io();
  socket.on('clients', function (clients) {
    console.log(clients);
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
