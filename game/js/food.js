
Food = new Phaser.Class({

    Extends: Phaser.GameObjects.Image,

    initialize: function (scene, x, y) {
        Phaser.GameObjects.Image.call(this, scene)

        this.setTexture('sprites', 'money');
        this.setPosition(x * 16, y * 16);
        this.setOrigin(0);

        this.total = 0;

        scene.children.add(this);
    },

    eat: function () {
        this.total++;

        var x = Phaser.Math.Between(0, 39);
        var y = Phaser.Math.Between(0, 29);

        this.setPosition(x * 16, y * 16);
    },

});
