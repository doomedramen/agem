import Phaser from 'phaser';

export default class extends Phaser.Sprite {

    constructor(game, x, y, texture) {
        super(game, x, y, texture);

        this.scale.set(game.SCALE);
        this.anchor.setTo(0.5);
    }

    getName() {
        return this.key
    }

    explode() {

    }


}
