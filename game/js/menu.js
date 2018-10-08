
MenuScene = new Phaser.Class({
	Extends: Phaser.Scene,

	initialize: function () {
		Phaser.Scene.call(this, { key: 'menuScene' });
	},

	preload: function () {
		this.load.atlas('sprites', '/static/game/assets/sprites.png', '/static/game/assets/sprites.json');
	},

    create: function () {
		var bg = this.add.image(320, 240, 'sprites', 'splash/base');
		bg.setInteractive();
		bg.on('pointerover', function (event) { bg.setFrame('splash/hover'); });
		bg.on('pointerout', function (event) { bg.setFrame('splash/base'); });
		bg.on('pointerdown', function (event) {
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
		this.load.atlas('sprites', '/static/game/assets/sprites.png', '/static/game/assets/sprites.json');
	},

    create: function () {
		var scores = window.highScores;
		this.add.text(16, 16, 'High Scores', { fontSize: '32px', color: '#000' });
		for (var i=0; i<scores.length; i++) {
			var item = scores[i];
			var txt = 'score: ' + item.score + ', email: ' + item.email;
			this.add.text(16, 50 + 16*i, txt, { fontSize: "16px", color: '#000' });
		}
    },

});
