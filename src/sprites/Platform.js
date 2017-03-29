import Phaser from 'phaser';
import Gem from './Gem';

export default class extends Phaser.Sprite {

    static Preload(game) {
        game.load.image('platform', 'assets/img/platform_no_flame.png');

        game.load.image('smoke1', 'assets/img/particles/smoke1.png');
        game.load.image('smoke2', 'assets/img/particles/smoke2.png');
        game.load.image('fire1', 'assets/img/particles/fire1.png');
        game.load.image('fire3', 'assets/img/particles/fire3.png');

    }


    constructor({game}) {
        super(game, game.world.centerX, game.scale.height - 100, 'platform');

        const scale = game.scale.width / this.width;
        this.scale.set(scale / 4);
        this.anchor.setTo(0.5);

        //init fire
        this.fireEmitter = game.add.emitter(this.x, this.y, 400);
        this.fireEmitter.makeParticles(['fire1','fire3']);
        this.fireEmitter.setYSpeed(800,1000);
        this.fireEmitter.setXSpeed(-50, 50);
        this.fireEmitter.setAlpha(1, 0, 3000);
        this.fireEmitter.setScale(0.2, 0, 0.2, 0, 400);
        this.fireEmitter.start(false, 3000, 5);

        this.smokeEmitter = game.add.emitter(this.x, this.y, 400);
        this.smokeEmitter.makeParticles(['smoke1', 'smoke2']);
        this.smokeEmitter.setYSpeed(400,500);
        this.smokeEmitter.setXSpeed(-50, 50);
        this.smokeEmitter.setAlpha(0.2, 0, 3000);
        this.smokeEmitter.setScale(0.3, 0, 0.3, 0, 300);
        this.smokeEmitter.start(false, 3000, 5);


        //init gems
        this.maxGemRowSize = 5;
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


    }

    // addGem(gem) {
    //     this.gems.push(gem);
    // }


    update() {
        // console.log('update gem');
        // this.position.x = this.position.x + 1;

        this.gems.slice(0).reverse().map((gemRow, i) => {
            gemRow.map((gem, ii) => {

                const startX = this.x - (this.width / 2) + (gem.width / 2);
                const marginLeft = (this.maxGemRowSize - gemRow.length) * (gem.width / 2);
                const x = startX + marginLeft + (ii * gem.width);
                const startY = this.y;
                const y = startY - (this.height / 2) - ((gem.height / 2) * i);

                gem.position.set(x, y); //1 pixel so you can tell them apart
            })
        });

        //update emitters
        this.fireEmitter.emitX = this.x;
        this.fireEmitter.emitY = this.y+40;
        this.smokeEmitter.emitX = this.x;
        this.smokeEmitter.emitY = this.y+40;

    }

}


/*
 -----[]
 ----[][]
 ---[][][]
 --[][][][]
 -[][][][][]
 */
