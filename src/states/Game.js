/* globals __DEV__ */
import Phaser from 'phaser'
import {randomNumber} from '../utils';
import Platform from '../sprites/Platform';
import Gems from '../sprites/gems/Gems';

export default class extends Phaser.State {

    static getScaler() {
        return 1440 / 1.5;
    }

    init() {
        // const self = this;
        this.score = 9876543210;

        this.fallSpeed = 1;
        this.timeBetweenGems = 2;
        this.timeBetweenMeteors = 10;

        this.GAMEOVER = false;


        this.gems = new Phaser.Group(this.game);
        game.world.bringToTop(this.gems);
    }

    preload() {

        this.game.load.image("background", "assets/img/background.png");

        game.load.bitmapFont('number-font', 'assets/fonts/number-font.png', 'assets/fonts/number-font.xml');

        Platform.Preload(this);
        Gems.Preload(game);
    }

    create() {
        const self = this;

        this.SCALE = (this.scale.width / this.constructor.getScaler());

        // console.log('SCALE', this.SCALE);
        // background
        // this.background = this.add.sprite(0, 0, 'background');
        // this.background.width = this.scale.width;
        // this.background.height = this.scale.height;

        // this.background.width = this.width;
        // this.background.height = this.height;

        //SCORE

        ////background
        const bgHeight = 254 * this.SCALE;
        let drawnObject;
        let bmd = game.add.bitmapData(this.scale.width, bgHeight);

        bmd.ctx.beginPath();
        bmd.ctx.rect(0, 0, this.scale.width, bgHeight);
        bmd.ctx.fillStyle = '#000000'; //black
        bmd.ctx.fill();
        drawnObject = game.add.sprite(game.world.centerX, 0, bmd);
        drawnObject.anchor.setTo(0.5, 0.5);

        ////numbers
        let scoreboard = this.add.bitmapText(this.world.centerX, 46 * this.SCALE, 'number-font', `${this.score}`, this.SCALE * 80);
        scoreboard.anchor.setTo(0.5);
        // score.font = 'Bangers';
        // score.padding.set(10, 16);
        // score.fontSize = 40;
        // score.fill = '#CCD1D9';
        // score.smoothed = false;


        //PLATFORM
        this.platform = new Platform(this);
        this.game.add.existing(this.platform);

        //DROP TIMER
        this.dropTimer = this.game.time.create(false);
        this.dropTimer.start();
        const dropGem = function () {
            const randomX = randomNumber(0, self.game.width);

            //TODO RandomGem

            const randomGemType = Gems.RandomGem();

            let gem = new randomGemType(self, randomX, -100);

            if (gem.x < gem.width / 2) {
                gem.x = gem.width / 2;
            }
            if (gem.x > self.scale.width - (gem.width / 2)) {
                gem.x = self.scale.width - (gem.width / 2);
            }

            // let gem = new Gem(self, randomX, -100);
            self.gems.add(gem, true);
            self.dropTimer.add(Phaser.Timer.SECOND * self.timeBetweenGems, dropGem, self);
        };
        dropGem();

    }

    // updateScore() {
    //     this.scoreNumbers = Numbers.getScore(this);
    // }

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

            gem.position.y += this.fallSpeed;

            if (gem.position.y > this.game.height + gem.height) {
                gem.destroy();
            }

        });
        this.GAMEOVER = this.platform.checkEndGame();

        //TODO check endgame

        if (this.GAMEOVER) {
            this.gameOver();
        }


        this.platform.x = this.game.input.x;

    }

    gameOver() {
        this.dropTimer.stop()
    }

    // randonGem() {
    //     const gemList = [GemOrange, GemBlue, GemMagenta, GemGreen];
    //     return gemList[Math.floor(Math.random() * gemList.length)];
    // }

    render() {

        //SHOW DEBUG INFO
        if (__DEV__) {
            this.game.debug.text(`gems:${this.gems.length}`, 32, 32);
            // this.game.debug.text(`fallSpeed:${this.fallSpeed}`, 32, 64);
            // this.game.debug.text(`timeBetweenGems:${this.timeBetweenGems}`, 32, 96);
            // this.game.debug.text(`platform X:${this.platform.x}`, 32, 128);
        }
    }
}
