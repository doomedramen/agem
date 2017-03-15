/* globals __DEV__ */
import Phaser from 'phaser'
import {randomNumber} from '../utils';
import Gem from '../sprites/Gem';
import Platform from '../sprites/Platform';
export default class extends Phaser.State {
    init() {
        // const self = this;
        this.score = 0;

        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = false;

        this.fallSpeed = 1;
        this.timeBetweenGems = 2;
        this.timeBetweenMeteors = 10;


        // this.scale.setScreenSize(true);

        // this.scale.setResizeCallback(function () {
        //     console.log('resize');
        //     scaleGame(self.game);
        //     // this.scale.setMaximum();
        //     // self.scale.setGameSize(10, 10);
        //
        // });

        this.gems = new Phaser.Group(this.game);
    }

    preload() {

        Platform.Preload(this);
        Gem.Preload(this);

    }

    create() {
        const self = this;

        //SCORE
        const scoreText = `${this.score}`;
        let score = this.add.text(this.world.centerX, 40, scoreText);
        // score.font = 'Bangers';
        score.padding.set(10, 16);
        score.fontSize = 40;
        score.fill = '#77BFA3';
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
            self.gems.add(new Gem({game: self, x: randomX}));
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
            gem.position.y += this.fallSpeed;
        });


        this.platform.x = this.game.input.x;

    }


    render() {

        //CALL UPDATE
        this.update();

        //SHOW DEBUG INFO
        if (__DEV__) {
            this.game.debug.text(`fallSpeed:${this.fallSpeed}`, 32, 32);
            this.game.debug.text(`timeBetweenGems:${this.timeBetweenGems}`, 32, 64);
            this.game.debug.text(`platform X:${this.platform.x}`, 32, 96);
        }
    }
}
