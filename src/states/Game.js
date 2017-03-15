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

        // this.gems = new Phaser.Group(this.game);
        this.gems = this.game.add.physicsGroup(Phaser.Physics.P2JS);
        // console.log(this.gems.events);
        // this.gems.events.onOutOfBounds.add(gem => {
        //     console.log('killed gem');
        //     gem.kill()
        // }, this);
    }

    preload() {

        Platform.Preload(this);
        Gem.Preload(this);

        this.game.load.physics('physicsData', 'assets/physics/platform.json');

    }

    create() {
        const self = this;

        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.physics.p2.gravity.y = 0;
        // this.game.physics.p2.restitution = 1.0;

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
        this.game.physics.p2.enable(this.platform, true);
        this.platform.body.clearShapes();
        this.platform.body.loadPolygon('physicsData', 'platform');
        this.platform.body.static = true;
        // this.platform.body.setZeroDamping();
        // this.platform.body.fixedRotation = true;

        //DROP TIMER
        this.dropTimer = this.game.time.create(false);
        this.dropTimer.start();
        const dropGem = function () {
            const randomX = randomNumber(0, self.game.width);

            let gem = new Gem({game: self, x: randomX});
            // gem.checkWorldBounds = true;
            // gem.events.onOutOfBounds.add(this.kill);
            // this.game.physics.p2.enable(gem);
            self.gems.add(gem, true);
            gem.angle = 45;
            gem.body.angle = 45;
            gem.body.collideWorldBounds = false;
            gem.body.fixedRotation = true;
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
            gem.body.y += this.fallSpeed;

            if (gem.position.y > this.game.height + gem.height) {
                gem.destroy();
            }

        });


        this.platform.body.setZeroVelocity();
        // this.platform.x = this.game.input.x;
        this.platform.body.x = this.game.input.x;

    }


    render() {

        //CALL UPDATE
        // this.update();

        //SHOW DEBUG INFO
        if (__DEV__) {
            this.game.debug.text(`gems:${this.gems.length}`, 32, 32);
            this.game.debug.text(`fallSpeed:${this.fallSpeed}`, 32, 64);
            this.game.debug.text(`timeBetweenGems:${this.timeBetweenGems}`, 32, 96);
            this.game.debug.text(`platform X:${this.platform.x}`, 32, 128);
        }
    }
}
