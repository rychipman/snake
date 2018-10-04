
Menu = new Phaser.Class({

    initialize: function (scene) {
		this.started = false;
		this.finished = false;
		this.text = scene.add.text(50, 50, 'press space to start', { fontSize: '32px', fill: '#000000' });
    },

    start: function () {
		if (this.started) {
			console.log('cannot start already-started game');
			return;
		}
		this.started = true;
		this.text.setText('');
    },

    stop: function () {
		if (!this.started) {
			console.log('cannot stop started game that is not started');
			return;
		} else if (this.finished) {
			console.log('cannot stop finished game');
			return;
		}
		this.finished = true;
		this.text.setText('Game Over');
    },

});
