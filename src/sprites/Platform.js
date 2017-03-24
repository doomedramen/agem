import Phaser from 'phaser';
import Gem from './Gem';

export default class extends Phaser.Sprite {

    static Preload(game) {
        game.load.image('platform', 'assets/images/platform.png');
    }


    constructor({game}) {
        super(game, game.world.centerX, game.scale.height - 50, 'platform');

        this.maxGemRowSize = 10;

        this.gems = [];

        for (let i = 1; i < this.maxGemRowSize + 1; i++) {
            let gemSet = [];
            for (let ii = 0; ii < i; ii++) {

                const gem = new Gem({game: game, x: 200, y: 200});
                this.game.add.existing(gem);
                gemSet.push(gem);
            }
            this.gems.push(gemSet);
        }


        const scale = game.scale.width / this.width;
        this.scale.set(scale / 3);
        this.anchor.setTo(0.5)
    }

    // addGem(gem) {
    //     this.gems.push(gem);
    // }


    update() {
        // console.log('update gem');
        // this.position.x = this.position.x + 1;

        const ym = 50;
        this.gems.slice(0).reverse().map((gemRow, i) => {
            gemRow.map((gem, ii) => {

                const startX = this.x - (this.width / 2);
                const marginLeft = (this.maxGemRowSize - gemRow.length) * (gem.width / 2);
                const x = startX + marginLeft + (ii * gem.width);
                const startY = this.y - (this.height / 2);
                const y = startY - (this.height / 2) - ((gem.height / 2) * i);

                gem.position.set(x, y);
            })
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
