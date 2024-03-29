import Phaser from 'phaser';

export default class extends Phaser.Sprite {

    static Preload(game) {
        game.load.image('attractor', 'assets/img/attractor.png');
    }

    constructor(game, x, y) {
        super(game, x, y, 'attractor');

        this.scale.set(game.SCALE);
        this.anchor.setTo(0.5);
    }

}
