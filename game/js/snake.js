
Snake = new Phaser.Class({

    initialize: function (scene, x, y) {
        this.headPosition = new Phaser.Geom.Point(x, y);

        this.body = scene.add.group();

		var px = coordsToPx(x, y);
        this.head = this.body.create(px.x, px.y, 'sprites', 'snake/head/left');
        this.head.setOrigin(0);

        this.alive = true;

        this.speed = 160;

        this.moveTime = 0;

        this.tail = new Phaser.Geom.Point(x, y);

        this.heading = RIGHT;
        this.direction = RIGHT;
    },

    update: function (time) {
        if (time >= this.moveTime) {
            return this.move(time);
        }
    },

    changeDirection: function(direction) {
		if (this.direction + direction == 0) {
			// we can't turn in the opposite direction
			return;
		}
		this.heading = direction;
	},

    move: function (time) {
        /**
        * Based on the heading property (which is the direction the pgroup pressed)
        * we update the headPosition value accordingly.
        * 
        * The Math.wrap call allow the snake to wrap around the screen, so when
        * it goes off any of the sides it re-appears on the other.
        */
        switch (this.heading)
        {
            case LEFT:
                this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x - 1, 0, GRID_DIM);
				this.head.setFrame('snake/head/left');
                break;

            case RIGHT:
                this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x + 1, 0, GRID_DIM);
				this.head.setFrame('snake/head/right');
                break;

            case UP:
                this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y - 1, 0, GRID_DIM);
				this.head.setFrame('snake/head/up');
                break;

            case DOWN:
                this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y + 1, 0, GRID_DIM);
				this.head.setFrame('snake/head/down');
                break;
        }

        this.direction = this.heading;

		var px = coordsToPx(this.headPosition.x, this.headPosition.y);
        var willHitBody = Phaser.Actions.GetFirst(this.body.getChildren(), px, 1);
        if (willHitBody) {
			this.die();
            return false;
        }

        //  Update the body segments
        Phaser.Actions.ShiftPosition(this.body.getChildren(), px.x, px.y, 1, this.tail);

		//  Update the timer ready for the next movement
		this.moveTime = time + this.speed;
		return true;
    },

	die: function() {
		this.alive = false;
		switch (this.direction) {
		case UP:
			this.head.setFrame('snake/head/dead/up');
			break;
		case DOWN:
			this.head.setFrame('snake/head/dead/down');
			break;
		case RIGHT:
			this.head.setFrame('snake/head/dead/right');
			break;
		case LEFT:
			this.head.setFrame('snake/head/dead/left');
			break;
		}
	},

    grow: function () {
        var newPart = this.body.create(this.tail.x, this.tail.y, 'sprites', 'snake/body');

        newPart.setOrigin(0);
    },

    collideWithFood: function (food) {
        if (this.head.x === food.x && this.head.y === food.y) {
            this.grow();

            food.eat();

            //  For every 5 items of food eaten we'll increase the snake speed a little
            if (this.speed > 20 && food.total % 5 === 0) {
                this.speed -= 5;
            }

            return true;
        }
        else
        {
            return false;
        }
    },

    updateGrid: function (grid) {
        //  Remove all body pieces from valid positions list
        this.body.children.each(function (segment) {

            var bx = pxToCoord(segment.x);
            var by = pxToCoord(segment.y);

            grid[by][bx] = false;

        });

        return grid;
    },

});
