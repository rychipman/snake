
MenuScene = new Phaser.Class({
	Extends: Phaser.Scene,

	preload: function () {
		this.load.atlas('sprites', '/static/game/assets/sprites.png', '/static/game/assets/sprites.json');
	},

    create: function () {
		var bg = this.add.image(320, 240, 'sprites', 'splash/base');
		bg.setInteractive();
		bg.on('pointerover', function (event) { bg.setFrame('splash/hover'); });
		bg.on('pointerout', function (event) { bg.setFrame('splash/base'); });
    },

});
