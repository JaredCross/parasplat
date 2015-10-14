// var app = angular.module('parasplat', ['btford.socket-io']).
//
// factory('socket', function (socketFactory) {
//   return socketFactory();
// }).
// controller('UsersController', function (socket, $scope) {
//   socket.on('clients', function (clients) {
//     console.log(clients);
//       $scope.users = clients.length + ' users online now!';
//   });
// });

var app = angular.module('parasplat', []);

app.controller('UsersController', function ($scope) {
  var socket = io();
  socket.on('clients', function (clients) {
    $scope.$apply(function () {
      $scope.users = clients.length + ' users online';
    });
  });
});
