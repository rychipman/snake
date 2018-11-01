
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
		var bg = this.add.image(0, 0, 'sprites', 'bg/splash/splash');

		var z = this.add.zone(290, 541, 136, 22);
		z.setOrigin(0, 0);
		z.setInteractive();
		z.on('pointerover', function (event) { bg.setFrame('bg/splash/hover'); });
		z.on('pointerout', function (event) { bg.setFrame('bg/splash/splash'); });
		z.on('pointerdown', function (event) {
			this.scene.start('gameScene');
		}, this);

		var me = this;
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
		this.input.keyboard.once('keydown_SPACE', function() {
			me.scene.start('menuScene');
		});
    },

});
