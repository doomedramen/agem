import Phaser from 'phaser';

export default class extends Phaser.Sprite {

    static Preload(game) {
        game.load.image('gem-blue', 'assets/img/gem-blue.png');
    }

    constructor({game, x, y}) {
        super(game, x, y, 'gem-blue');

        const gemSize = game.scale.width / 20;
        this.width = gemSize;
        this.height = gemSize;
        this.anchor.setTo(0.5);
    }

}
