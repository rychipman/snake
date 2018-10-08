
GameScene = new Phaser.Class({
	Extends: Phaser.Scene,

	initialize: function () {
		Phaser.Scene.call(this, { key: 'gameScene' });
	},

	preload: function () {
		this.load.atlas('sprites', '/static/game/assets/sprites.png', '/static/game/assets/sprites.json');
	},


	create: function () {
		this.score = new Score(this, 10, 10);
		this.scoreSent = false;

		this.food = new Food(this, 3, 4);
		this.snake = new Snake(this, 8, 8);

		//  Create our keyboard controls
		this.cursors = this.input.keyboard.createCursorKeys();
	},

	update: function (time, delta) {
		if (!this.snake.alive) {
			if (!this.scoreSent) {
				this.add.text(50, 50, 'press space to continue', { fontSize: '32px', fill: '#000' });
				this.score.submit();
				this.scoreSent = true;
			}
			if (this.cursors.space.isDown) {
				this.scene.start('leaderboardScene');
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

		for (var y = 0; y < 30; y++) {
			testGrid[y] = [];

			for (var x = 0; x < 40; x++) {
				testGrid[y][x] = true;
			}
		}

		this.snake.updateGrid(testGrid);

		//  Purge out false positions
		var validLocations = [];

		for (var y = 0; y < 30; y++) {
			for (var x = 0; x < 40; x++) {
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
			this.food.setPosition(pos.x * 16, pos.y * 16);

			return true;
		} else {
			return false;
		}
	},

});


var game = new Phaser.Game({
    type: Phaser.WEBGL,
    width: 640,
    height: 480,
    backgroundColor: '#eeeeee',
    parent: 'snake-frame',
	scene: [ MenuScene, GameScene, LeaderboardScene ],
});
