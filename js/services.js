var app = angular.module('parasplat', ['ngRoute', 'ngAnimate']);

app.factory('loginService', function ($http, $location) {
  return {
    isLogged: function () {
      var $check = $http.post('/checkstatus');
      return $check;
    }
  };
});

app.run(function ($rootScope, $location, loginService, $scope) {
  // var routPermission = [
  //             '/abAdmin/home',
  //             '/abAdmin/category',
  //             '/abAdmin/category/:id'];


  $rootScope.$on('$routeChangeStart', function (e, current) {

    //  if ( routPermission.indexOf(current.$$route.originalPath) != -1) {
        var connected = loginService.isLogged();
        connected.then(function (data) {
          if (data.data.email) {
            $scope.loggedIn = true;
            $scope.user = data.data;
          }
        });
    // }
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
      game.destroy();
      socket.emit('leaveGameLobby');
      socket.emit('leaveGameRoom');
    }
  };

});
