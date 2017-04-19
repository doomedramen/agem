import Phaser from 'phaser';

export default class extends Phaser.Sprite {

    // static Preload(game) {
    //     game.load.image('gem-null', 'assets/img/gem-null.png');
    // }

    constructor(game, x, y) {
        super(game, x, y, 'gem-null');

        this.scale.set(game.SCALE);
        this.anchor.setTo(0.5);
    }

}
