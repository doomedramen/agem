import Phaser from 'phaser';

export default class extends Phaser.Sprite {

    static Preload(game) {
        game.load.image('gem-green', 'assets/img/gem-green.png');
    }

    constructor({game, x, y}) {
        super(game, x, y, 'gem-green');


        const gemSize = game.scale.width / 20;
        this.width = gemSize;
        this.height = gemSize;
        // this.scale.set(gemScale);
        this.anchor.setTo(0.5);
        // this.angle = 45;
    }

    update() {
        // console.log('update gem');
        // this.position.x = this.position.x + 1;
    }

}
