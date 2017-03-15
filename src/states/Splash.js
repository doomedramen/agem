import Phaser from 'phaser'
import {centerGameObjects} from '../utils'

export default class extends Phaser.State {
    init() {
    }

    preload() {
        this.load.image('piddy', 'assets/images/piddy.png');
        // this.logo = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'piddy')
        // centerGameObjects([this.logo]);

        // this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
        // centerGameObjects([this.loaderBg, this.loaderBar])

        // this.load.setPreloadSprite(this.loaderBar)
        //
        // load your assets
        //
        //
    }

    create() {
        this.logo = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'piddy');
        centerGameObjects([this.logo]);

    }

    update() {
        if (this.game.input.activePointer.isDown) {
            this.state.start('Game')
        }
    }

}
