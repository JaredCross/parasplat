var app = angular.module('parasplat', ['ngRoute', 'ngAnimate']);

var game = false;


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
