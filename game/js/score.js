
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
			score: this.score,
			email: 'anonymous',
		};

		var request = new XMLHttpRequest();
		request.open('POST', '/api/scores/new', true);
		request.setRequestHeader('Content-Type', 'application/json');

		request.onreadystatechange = function() {
			if (this.readyState === 4) {
				if (this.status >= 200 && this.status < 400) {
					var data = JSON.parse(this.responseText);
					if (data.status === "failed") {
						console.log("score submit failed");
					} else {
						console.log("score submit successful");
						highScores = data.highScores
					}
				} else {
					console.log("score submit failed")
				}
			}
		};

		request.send(JSON.stringify(data));
	},
})
