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
