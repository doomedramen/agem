import Phaser from 'phaser';

export default class extends Phaser.Sprite {

    static Preload(game) {
        game.load.image('attractor', 'assets/img/attractor.png');
    }

    constructor(game, x, y) {
        super(game, x, y, 'attractor');

        // const gemSize = game.scale.width / 20;
        // this.width = gemSize;
        // this.height = gemSize;
        this.scale.set(game.SCALE);
        // console.log('ISSUE IS HERE',game.SCALE);
        // this.scale.set(game.SCALE*10);
        this.anchor.setTo(0.5);
    }

}
