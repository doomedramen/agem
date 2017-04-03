import Phaser from 'phaser';

export default class extends Phaser.Sprite {

    constructor(game, x, y, texture) {
        super(game, x, y, texture);

        // const gemSize = game.scale.width / 20;
        // this.width = gemSize;
        // this.height = gemSize;
        // const scale = game.scale.width / this.width;
        // this.scale.set(scale / 10);
        this.scale.set(game.SCALE);
        console.log('IS IT THE SAME HERE', game.SCALE);
        this.anchor.setTo(0.5);
    }

    getName() {
        return this.key
    }

    explode() {

    }


}
