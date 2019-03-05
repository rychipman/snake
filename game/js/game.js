
GameScene = new Phaser.Class({
	Extends: Phaser.Scene,

	initialize: function () {
		Phaser.Scene.call(this, { key: 'gameScene' });
	},

	preload: function () {
		this.load.setPath('/static/game/assets/');
		this.load.multiatlas('sprites', 'sprites.json');
	},

	create: function () {
		this.board = this.add.sprite(0, 0, 'sprites');
		this.board.displayWidth = 680;
		this.board.displayHeight = 680;
		this.anims.create({
			key: 'anibg',
			frames: this.anims.generateFrameNames('sprites', { prefix: 'bg/aniboard/aniboard_', start: 0, end: 19, zeroPad: 2 }),
			frameRate: 10,
			repeat: -1,
		});
		this.board.play('anibg');

		this.score = new Score(this, 10, 10);
		this.scoreSent = false;

		this.food = new Food(this, 3, 4);
		this.snake = new Snake(this, 8, 8);

		//  Create our keyboard and touch controls
		this.cursors = this.input.keyboard.createCursorKeys();

		var me = this;
		this.input.on('pointerdown', function(ptr) {
			me.downX = ptr.x;
			me.downY = ptr.y;
		});
		this.input.on('pointerup', function(ptr) {
			upX = ptr.x;
			upY = ptr.y;
			me.swipeDX = upX - me.downX;
			me.swipeDY = upY - me.downY;
			//console.log('(dx, dy) = ('+me.swipeDX+', '+me.swipeDY+')');
			me.swiped = true;
		});

		this.sceneTransitionStarted = false;
		this.cameras.main.fadeFrom(500, 0, 0, 0);
	},

	update: function (time, delta) {
		if (!this.snake.alive) {
			if (!this.sceneTransitionStarted) {
				var me = this;
				yourscore = me.score.score;
				setTimeout(function() {
					me.cameras.main.fade(500, 9, 11, 9, false, function(cam, prg) {
						if (prg == 1) {
							showSubmitForm(function() {
								me.scene.start('menuScene');
							});
						}
					});
				}, 500);
				this.sceneTransitionStarted = true;
			}
			return;
		}

		if (this.cursors.left.isDown) {
			this.snake.changeDirection(LEFT);
		} else if (this.cursors.right.isDown) {
			this.snake.changeDirection(RIGHT);
		} else if (this.cursors.up.isDown) {
			this.snake.changeDirection(UP);
		} else if (this.cursors.down.isDown) {
			this.snake.changeDirection(DOWN);
		} else if (this.swiped) {

			var newDirection;
			switch (this.snake.direction) {
			case UP:
			case DOWN:
				if (this.swipeDX > 0) {
					newDirection = RIGHT;
				} else {
					newDirection = LEFT;
				}
				break;
			case RIGHT:
			case LEFT:
				if (this.swipeDY > 0) {
					newDirection = DOWN;
				} else {
					newDirection = UP;
				}
				break;
			}

			this.swiped = false;

			if (newDirection) {
				this.snake.changeDirection(newDirection);
			}
		}

		if (this.snake.update(time)) {
			if (this.snake.collideWithFood(this.food)) {
				this.score.increment();
				this.repositionFood();
			}
		}
	},

	/**
	* We can place the food anywhere in our 40x30 grid
	* *except* on-top of the snake, so we need
	* to filter those out of the possible food locations.
	* If there aren't any locations left, they've won!
	*
	* @method repositionFood
	* @return {boolean} true if the food was placed, otherwise false
	*/
	repositionFood: function () {
		//  First create an array that assumes all positions
		//  are valid for the new piece of food

		//  A Grid we'll use to reposition the food each time it's eaten
		var testGrid = [];

		for (var y = 0; y < GRID_DIM_Y; y++) {
			testGrid[y] = [];

			for (var x = 0; x < GRID_DIM_X; x++) {
				testGrid[y][x] = true;
			}
		}

		this.snake.updateGrid(testGrid);

		//  Purge out false positions
		var validLocations = [];

		for (var y = 0; y < GRID_DIM_Y; y++) {
			for (var x = 0; x < GRID_DIM_X; x++) {
				if (testGrid[y][x] === true) {
					//  Is this position valid for food? If so, add it here ...
					validLocations.push({ x: x, y: y });
				}
			}
		}

		if (validLocations.length > 0) {
			//  Use the RNG to pick a random food position
			var pos = Phaser.Math.RND.pick(validLocations);

			//  And place it
			var px = coordsToPx(pos.x, pos.y);
			this.food.setPosition(px.x, px.y);

			return true;
		} else {
			return false;
		}
	},

});

function submitScore(callback) {
	var data = {
		score: window.yourscore,
		email: window.youremail,
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
					callback();
				} else {
					console.log("score submit successful");
					highScores = data.highScores;
					callback();
				}
			} else {
				console.log("score submit failed")
				callback();
			}
		}
	};

	request.send(JSON.stringify(data));
}

function showSubmitForm(callback) {
	var scoreHeader = document.getElementById('score-header');
	scoreHeader.innerHTML = '' + window.yourscore;

	var nameInput = document.getElementById('name');
	var emailInput = document.getElementById('email');

	nameInput.value = window.yourname ? window.yourname : 'Your Name';
	emailInput.value = window.youremail ? window.youremail : 'email@example.com';

	if (!window.yourname) {
		nameInput.focus();
		nameInput.select();
	}

	var game = document.getElementById('game');
	var submit = document.getElementById('submit');
	var leaderboard = document.getElementById('leaderboard');

	var parent = game.parentNode;

	var submitBtn = document.getElementById('submit-btn');
	submitBtn.onclick = function() {
		yourname = nameInput.value;
		youremail = emailInput.value;
		submitScore(function() {
			var scores = document.getElementById('scores-container');
			scores.parentNode.removeChild(scores);
			scores = document.createElement('div');
			scores.id = 'scores-container';
			for (var i=0; i<window.highScores.length; i++) {
				var s = window.highScores[i];
				var p = document.createElement('p');
				p.innerHTML = ''+s.score+' - '+s.email;
				scores.appendChild(p);
			}
			leaderboard.appendChild(scores);
			parent.removeChild(submit);
		});
	};

	parent.removeChild(game);

	leaderboard.onclick = function() {
		parent.appendChild(submit);
		parent.appendChild(game);
		callback();
	};
};


var game = new Phaser.Game({
    type: Phaser.WEBGL,
    width: 680,
    height: 680,
    backgroundColor: '#181b18',
    parent: 'game',
	scene: [ MenuScene, GameScene ],
});
