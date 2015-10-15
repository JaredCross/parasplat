var app = angular.module('parasplat', []);

app.controller('UsersController', function ($scope) {
  var socket = io();
  socket.on('clients', function (clients) {
    $scope.$apply(function () {
      $scope.users = clients.length + ' users online';
    });
  });
});
