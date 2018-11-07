
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
		this.topStrip = this.add.image(fracToPxX(.5), 0, 'sprites', 'strip/top');
		this.topStrip.setScale(stripScale, stripScale);
		this.bottomStrip = this.add.image(fracToPxX(.5), logicalHeight, 'sprites', 'strip/bottom');
		this.bottomStrip.setScale(stripScale, stripScale);

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
			me.swiped = true;
		});

		this.continueMessagePosted = false;
	},

	update: function (time, delta) {
		if (!this.snake.alive) {
			if (!this.continueMessagePosted) {
				var me = this;
				var nextScene = function() {
					yourscore = me.score.score;
					me.score.submit();
					me.scene.start('leaderboardScene');
				};

				//this.board.setFrame('bg/board/dead');
				this.input.keyboard.once('keydown_SPACE', nextScene);
				this.input.on('pointerdown', nextScene);

				this.continueMessagePosted = true;
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
    width: logicalWidth,
    height: logicalHeight,
    backgroundColor: '#181b18',
    parent: 'snake-frame',
	scene: [ MenuScene, GameScene, LeaderboardScene ],
});
