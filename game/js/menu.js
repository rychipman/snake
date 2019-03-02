
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

		var me = this;
		this.input.on('pointerdown', function (event) {
			me.scene.start('gameScene');
		});
		this.input.keyboard.once('keydown_SPACE', function() {
			me.scene.start('gameScene');
		});
    },

});

LeaderboardScene = new Phaser.Class({
	Extends: Phaser.Scene,

	initialize: function () {
		Phaser.Scene.call(this, { key: 'leaderboardScene' });
	},

	preload: function () {
		this.load.setPath('/static/game/assets/');
		this.load.multiatlas('sprites', 'sprites.json');
	},

    create: function () {
		this.add.image(0, 0, 'sprites', 'bg/scores');
		this.cursors = this.input.keyboard.createCursorKeys();
		this.add.text(16, 16, '(press space to exit)', { fontSize: '16px', color: '#FFF' });
		this.add.text(16, 48, 'Your Score: ' + window.yourscore, { fontSize: '16px', color: '#FFF' });

		var me = this;
		var nextScene = function() {
			me.scene.start('menuScene');
		};

		this.input.keyboard.once('keydown_SPACE', nextScene);
		this.input.on('pointerdown', nextScene);
    },

});
