/* globals __DEV__ */
import Phaser from 'phaser'
import {randomNumber} from '../utils';
import Gem from '../sprites/Gem';
import Platform from '../sprites/Platform';
export default class extends Phaser.State {
    init() {
        // const self = this;
        this.score = 0;

        // this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        // this.scale.pageAlignHorizontally = true;
        // this.scale.pageAlignVertically = false;

        this.fallSpeed = 1;
        this.timeBetweenGems = 2;
        this.timeBetweenMeteors = 10;


        this.gems = new Phaser.Group(this.game);
    }

    preload() {

        this.game.load.image("background", "assets/img/background.png");

        Platform.Preload(this);
        Gem.Preload(this);
    }

    create() {
        const self = this;

        // background
        // this.background = this.add.sprite(0, 0, 'background');
        // this.background = this.game.add.tileSprite(0, 0, 200, 200, 'background');
        // this.background.width = this.world.width;
        // this.background.height = this.world.height;
        // this.background.width = this.width;
        // this.background.height = this.height;

        //SCORE
        const scoreText = `${this.score}`;
        let score = this.add.text(this.world.centerX, 40, scoreText);
        // score.font = 'Bangers';
        score.padding.set(10, 16);
        score.fontSize = 40;
        score.fill = '#CCD1D9';
        score.smoothed = false;
        score.anchor.setTo(0.5);

        //PLATFORM
        this.platform = new Platform({game: this});
        this.game.add.existing(this.platform);

        //DROP TIMER
        this.dropTimer = this.game.time.create(false);
        this.dropTimer.start();
        const dropGem = function () {
            const randomX = randomNumber(0, self.game.width);

            let gem = new Gem({game: self, x: randomX, y: -100});
            self.gems.add(gem, true);
            self.dropTimer.add(Phaser.Timer.SECOND * self.timeBetweenGems, dropGem, self);
        };
        dropGem();

    }

    update() {

        //UPDATE SPEEDS
        this.fallSpeed += 0.0001;
        this.timeBetweenGems -= 0.0001;


        //UPDATE GEM POSITIONS
        this.gems.forEachAlive(gem => {

            if (this.platform.checkCollision(gem)) {
                //todo remove this gem
                this.gems.remove(gem);
            }

            //TODO check if collides with platform
            // this.platform.getAttractors().map(attractor=>{
            //     if(Phaser.Rectangle.intersects(gem, attractor)){
            //
            //     }
            // });


            gem.position.y += this.fallSpeed;

            if (gem.position.y > this.game.height + gem.height) {
                gem.destroy();
            }

        });


        this.platform.x = this.game.input.x;

    }


    render() {

        //SHOW DEBUG INFO
        if (__DEV__) {
            this.game.debug.text(`gems:${this.gems.length}`, 32, 32);
            this.game.debug.text(`fallSpeed:${this.fallSpeed}`, 32, 64);
            this.game.debug.text(`timeBetweenGems:${this.timeBetweenGems}`, 32, 96);
            this.game.debug.text(`platform X:${this.platform.x}`, 32, 128);
        }
    }
}
