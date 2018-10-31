
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
		z.on('pointerover', function (event) { console.log("OVER"); bg.setFrame('bg/splash/hover'); });
		z.on('pointerout', function (event) { bg.setFrame('bg/splash/splash'); });
		z.on('pointerdown', function (event) {
			this.scene.start('gameScene');
		}, this);
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
		var scores = window.highScores;
		this.title = this.add.text(16, 16, 'High Scores (press space to exit)', { fontSize: '32px', color: '#FFF' });
		for (var i=0; i<scores.length; i++) {
			var item = scores[i];
			var txt = 'score: ' + item.score + ', email: ' + item.email;
			this.add.text(16, 50 + 16*i, txt, { fontSize: "16px", color: '#FFF' });
		}

		var me = this;
		this.input.keyboard.once('keydown_SPACE', function() {
			me.scene.start('menuScene');
		});
    },

});
