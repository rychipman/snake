
Score = new Phaser.Class({

	initialize: function (scene, x, y) {
		this.text = scene.add.text(16, 16, 'no score', { fontSize: '32px', fill: '#000000' });
		this.score = 0;
	},

	increment: function () {
		this.score = this.score + 1;
		this.text.setText('Score: ' + this.score);
	},
})
