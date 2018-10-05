
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
		var items = [
			{score: 100, email: 'anon'},
			{score: 100, email: 'anon'},
			{score: 200, email: 'abc'},
		];
		for (var i=0; i<items.length; i++) {
			var txt = 'score: ' + items[i].score + ', email: ' + items[i].email;
			this.add.text(16, 16 + 16*i, txt, { fontSize: "16px", color: '#000' });
		}
    },

});
