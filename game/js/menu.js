
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
		var bg = this.add.image(fracToPxX(.5), 0, 'sprites', 'bg/splash/splash');

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
		this.add.image(fracToPxX(.5), 0, 'sprites', 'bg/scores');
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
