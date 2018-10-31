
Food = new Phaser.Class({

    Extends: Phaser.GameObjects.Image,

    initialize: function (scene, x, y) {
        Phaser.GameObjects.Image.call(this, scene)

        this.setTexture('sprites', 'food/money');
		var px = coordsToPx(x, y);
        this.setPosition(px.x, px.y);
        this.setOrigin(0);

        this.total = 0;

        scene.children.add(this);
    },

    eat: function () {
        this.total++;

        var x = Phaser.Math.Between(0, GRID_DIM);
        var y = Phaser.Math.Between(0, GRID_DIM);

		var px = coordsToPx(x, y);
        this.setPosition(px.x, px.y);
    },

});
