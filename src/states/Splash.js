import Phaser from 'phaser'
import {centerGameObjects} from '../utils'

export default class extends Phaser.State {
    preload() {
        this.load.image('piddy', 'assets/img/piddy.png');
    }

    create() {

        this.touched = false;

        this.logo = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'piddy');
        centerGameObjects([this.logo]);
    }

    update() {
        if (!this.touched && this.game.input.activePointer.isDown) {
            this.touched = true;
            this.state.start('Game')
        }
    }

}
