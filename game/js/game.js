
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

    getScores: function(success, failure) {
		var request = new XMLHttpRequest();
		request.open('GET', '/api/scores/top', true);

		request.onreadystatechange = function() {
			if (this.readyState === 4) {
				if (this.status >= 200 && this.status < 400) {
					var data = JSON.parse(this.responseText);
					if (data.status === "failed") {
						console.log("get scores failed");
						failure();
					} else {
						console.log("get scores successful");
						highScores = data.highScores;
						success();
					}
				} else {
					console.log("get scores")
				}
			}
		};

		request.send();
	},

	update: function (time, delta) {
		if (!this.snake.alive) {
			if (!this.sceneTransitionStarted) {
				var me = this;
				yourscore = me.score.score;
				me.getScores(function() {
					setTimeout(function() {
						me.cameras.main.fade(1000, 0, 0, 0, false, function(cam, prg) {
							if (prg == 1) {
								me.scene.start('leaderboardScene');
							}
						});
					}, 1000);
				}, function() {
					me.scene.start('menuScene');
				});
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


var game = new Phaser.Game({
    type: Phaser.WEBGL,
    width: 680,
    height: 680,
    backgroundColor: '#181b18',
    parent: 'snake-frame',
	scene: [ MenuScene, GameScene, LeaderboardScene ],
});
