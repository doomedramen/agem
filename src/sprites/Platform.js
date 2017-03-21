import Phaser from 'phaser';
import Gem from './Gem';

export default class extends Phaser.Sprite {

    static Preload(game) {
        game.load.image('platform', 'assets/images/platform.png');
    }

    constructor({game}) {

        super(game, game.world.centerX, game.scale.height - 50, 'platform');

        this.gems = {a: [], b: [], c: [], d: [], e: []};


        const scale = game.scale.width / this.width;
        this.scale.set(scale / 3);
        this.anchor.setTo(0.5)
    }

    addGem(gem) {
        this.gems.push(gem);
    }

    update() {
        // console.log('update gem');
        // this.position.x = this.position.x + 1;

        this.gems.map(gem => {

        })

    }

}


/*


 -----[]
 ----[][]
 ---[][][]
 --[][][][]
 -[][][][][]


 */
