var config = {
    type: Phaser.WEBGL,
    width: 640,
    height: 480,
    backgroundColor: '#f79e2e',
    parent: 'snake-frame',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var snake;
var cursors;
var game = new Phaser.Game(config);

function preload () {
	this.load.atlas('sprites', '/static/game/assets/sprites.png', '/static/game/assets/sprites.json');
}

function create () {

	menu = new Menu(this);
	score = new Score(this, 10, 10);
    food = new Food(this, 3, 4);
    snake = new Snake(this, 8, 8);

    //  Create our keyboard controls
    cursors = this.input.keyboard.createCursorKeys();
}

function update (time, delta) {
	if (cursors.space.isDown && !menu.started) {
		menu.start();
	}

	if (!menu.started || menu.finished) {
		return;
	}

    if (!snake.alive) {
		menu.stop();
        return;
    }

    if (cursors.left.isDown) {
        snake.changeDirection(LEFT);
    } else if (cursors.right.isDown) {
        snake.changeDirection(RIGHT);
    } else if (cursors.up.isDown) {
        snake.changeDirection(UP);
    } else if (cursors.down.isDown) {
        snake.changeDirection(DOWN);
    }

    if (snake.update(time)) {
        if (snake.collideWithFood(food)) {
			score.increment();
            repositionFood();
        }
    }
}

/**
* We can place the food anywhere in our 40x30 grid
* *except* on-top of the snake, so we need
* to filter those out of the possible food locations.
* If there aren't any locations left, they've won!
*
* @method repositionFood
* @return {boolean} true if the food was placed, otherwise false
*/
function repositionFood () {
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

    snake.updateGrid(testGrid);

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
        food.setPosition(pos.x * 16, pos.y * 16);

        return true;
    } else {
        return false;
    }
}
