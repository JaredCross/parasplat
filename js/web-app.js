var app = angular.module('parasplat', ['ngRoute']);



app.controller('UsersController', function ($scope) {
  var socket = io();
  socket.on('clients', function (clients) {
    console.log(clients);
    $scope.$apply(function () {
      $scope.users = clients.length + ' users online';
    });
  });
});

app.controller('ApplicationController', function ($scope, $route, $routeParams, $location, $http) {
  $scope.$route = $route;
  $scope.$location = $location;
  $scope.$routeParams = $routeParams;
});

// app.config(function($routeProvider, $locationProvider){
//   $routeProvider.when("/",
//     {
//       templateUrl: "/partials/home.html",
//       controller: "ApplicationController",
//       controllerAs: "app",
//     });
// });
