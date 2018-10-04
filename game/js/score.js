
Score = new Phaser.Class({

	initialize: function (scene, x, y) {
		this.text = scene.add.text(16, 16, 'no score', { fontSize: '32px', fill: '#000000' });
		this.score = 0;
	},

	increment: function () {
		this.score = this.score + 1;
		this.text.setText('Score: ' + this.score);
	},

	submit: function() {
		console.log("submitting score: " + this.score);

		var data = {
			id: 2,
			score: this.score,
			email: 'anonymous',
		};

		var request = new XMLHttpRequest();
		request.open('POST', '/api/scores/new', true);
		request.setRequestHeader('Content-Type', 'application/json');
		request.send(JSON.stringify(data));
	},
})
