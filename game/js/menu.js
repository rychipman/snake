
MenuScene = new Phaser.Class({
	Extends: Phaser.Scene,

	initialize: function () {
		Phaser.Scene.call(this, { key: 'menuScene' });
	},

	preload: function () {
		this.load.setPath('/static/game/assets/');
		this.load.multiatlas('sprites', 'sprites.json');
	},

    create: function () {
		var bg = this.add.sprite(0, 0, 'sprites');
		bg.displayWidth = 680;
		bg.displayHeight = 680;
		this.anims.create({
			key: 'splash',
			frames: this.anims.generateFrameNames('sprites', { prefix: 'bg/anisplash/anisplash_', start: 0, end: 19, zeroPad: 2 }),
			frameRate: 10,
			repeat: -1,
		});
		bg.play('splash');

		var info = this.add.image(0, 680, 'sprites', 'bg/splash-info');
		var play = this.add.image(353, 545, 'sprites', 'bg/play-to-win')
		play.setSize(100, 100)
		play.setInteractive()
			.on('pointerover', function() { play.setFrame('bg/play-snake') })
			.on('pointerout', function() { play.setFrame('bg/play-to-win') });

		var me = this;
		var nextScene = function() {
			me.cameras.main.fade(1000, 0, 0, 0, false, function(cam, prg) {
				if (prg == 1) {
					me.scene.start('gameScene');
				}
			});
		}

		this.input.on('pointerdown', nextScene);
		this.input.keyboard.once('keydown_SPACE', nextScene);
    },

});
