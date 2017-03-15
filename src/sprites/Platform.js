import Phaser from 'phaser';

export default class extends Phaser.Sprite {

    static Preload(game) {
        game.load.image('platform', 'assets/images/platform.png');
    }

    constructor({game}) {

        super(game, game.world.centerX, game.scale.height-50, 'platform');

        // const scale = game.scale.width / this.width;
        // this.scale.set(scale/3);

        this.anchor.setTo(0.5)
    }

    update() {
        // console.log('update gem');
        // this.position.x = this.position.x + 1;
    }

}
