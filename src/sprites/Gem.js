import Phaser from 'phaser';

export default class extends Phaser.Sprite {

    constructor(game, x, y, texture) {
        super(game, x, y, texture);

        const gemSize = game.scale.width / 20;
        this.width = gemSize;
        this.height = gemSize;
        this.anchor.setTo(0.5);
    }

    getName() {
        return this.key
    }

    explode() {

    }


}
