import Phaser from 'phaser';
import Gem from './gems/Gem';
import Attractor from './Attractor';
import NullGem from './NullGem';

export default class extends Phaser.Sprite {

    static Preload(game) {

        game.time.advancedTiming = true;

        Attractor.Preload(game);
        game.load.image('platform', 'assets/img/platform_no_flame.png');

        game.load.image('smoke1', 'assets/img/particles/smoke1.png');
        game.load.image('smoke2', 'assets/img/particles/smoke2.png');
        game.load.image('fire1', 'assets/img/particles/fire1.png');
        game.load.image('fire3', 'assets/img/particles/fire3.png');

    }


    constructor(game) {
        super(game, game.world.centerX, game.scale.height - (100 * game.SCALE), 'platform');

        // const scale = game.scale.width / this.width;
        // this.scale.set(scale / 10);
        this.scale.set(game.SCALE);
        this.anchor.setTo(0.5);

        //init fire
        this.fireEmitter = game.add.emitter(this.x, this.y, 400);
        this.fireEmitter.makeParticles(['fire1', 'fire3']);
        this.fireEmitter.setYSpeed(800, 1000);
        this.fireEmitter.setXSpeed(-50, 50);
        this.fireEmitter.setAlpha(1, 0, 3000);
        this.fireEmitter.setScale(game.SCALE * 0.4, 0, game.SCALE * 0.4, 0, 400);
        this.fireEmitter.start(false, 3000, 5);

        this.smokeEmitter = game.add.emitter(this.x, this.y, 400);
        this.smokeEmitter.makeParticles(['smoke1', 'smoke2']);
        this.smokeEmitter.setYSpeed(400, 500);
        this.smokeEmitter.setXSpeed(-50, 50);
        this.smokeEmitter.setAlpha(0.2, 0, 3000);
        this.smokeEmitter.setScale(game.SCALE * 0.5, 0, game.SCALE * 0.5, 0, 300);
        this.smokeEmitter.start(false, 3000, 5);


        this.full = false;


        //init gems
        this.maxGemRowSize = 5;
        this.gemRows = [];

        for (let i = 1; i < this.maxGemRowSize + 1; i++) {
            // let gemSet = [];
            let gemSet = new Phaser.Group(this.game);
            for (let ii = 0; ii < i; ii++) {
                // gemSet.push(null);
                gemSet.add(new NullGem(game, 0, 0), true);
                // gemSet.push(new NullGem(game, 0, 0));
            }
            this.gemRows.push(gemSet);
        }

        this.gems = new Phaser.Group(this.game);

        this.updateAttractors();


    }

    scaleBounds(rec, scale) {
        return new Phaser.Rectangle(rec.x + (rec.width / (scale / 2)), rec.y + (rec.height / (scale / 2)), rec.width * scale, rec.height * scale);
    }

    checkCollision(gem) {

        let collision = false;
        const boundsA = gem.getBounds();

        this.gemRows.map((gemRow, i) => {
            if (!collision) {
                let ii = -1;
                gemRow.forEachAlive(attractor => {
                    ii++;
                    if (!collision) {
                        if (attractor instanceof Attractor) {
                            const boundsB = attractor.getBounds();
                            if (Phaser.Rectangle.intersects(this.scaleBounds(boundsA, 0.5), this.scaleBounds(boundsB, 0.5))) {
                                collision = true;
                                this.insertExistingGem(gem, i, ii);
                            }
                        }
                    }
                })
            }
        });
        return collision;

    }

    cleanupDeadGems() {
        this.gemRows.map(gr => {
            console.log('removing dead gem');
            gr.forEachDead(dead => {
                dead.destroy();
            })
        });
    }

    postChangeCheck() {
        this.updateGemPositions();
        this.cleanupDeadGems();
        this.checkMatch();
        this.checkIfFull();
        this.checkGemGravity();
        this.updateAttractors();
    }

    insertExistingGem(gem, i, ii) {
        console.log('inserting existing');
        let oldGem = this.gemRows[i].getAt(ii);
        if (oldGem) {
            this.gemRows[i].replace(oldGem, gem);
        }
        this.postChangeCheck();

    }

    checkIfFull() {
        let full = true;
        this.gemRows.map((gemRow, i) => {
            gemRow.forEachAlive(gem => {
                if (!(gem instanceof Gem) && gemRow.length - 1 === i) {
                    full = false;
                }
            });
        });

        if (full) {
            this.full = full;
        }
    }

    checkEndGame() {
        return this.full;
    }

    moveGem(y, x, yy, xx) { //from, to


        let from = this.gemRows[y].getAt(x);
        let to = this.gemRows[yy].getAt(xx);

        console.log('making new', from.constructor);

        let old1 = this.gemRows[yy].replace(to, new from.constructor(this.game, 0, 0));
        let old2 = this.gemRows[yy].replace(from, new NullGem(this.game, 0, 0));

        // let this.gemRows[yy].replace(to, from);
        // this.gemRows[yy].replace(from, new NullGem(this.game, 0, 0));


    }

    checkGemGravity() {

        // console.log('checking gravity');

        let gemsFell = false;

        for (let i = this.gemRows.length - 1; i >= 0; i--) { //bottom to top

            let gemRow = this.gemRows[i];
            let ii = -1;
            gemRow.forEachAlive(gem => { //left to right
                ii++;

                if (gem instanceof Gem) {

                    let rand = Math.round(Math.random());

                    if (this.gemRows[i + 1]) {

                        //check below left //todo not working
                        let bl = undefined;
                        if (ii >= 0 && ii <= gemRow.length - 1) {
                            bl = this.gemRows[i + 1].getAt(ii);
                        }

                        //check below right //todo working
                        let br = undefined;
                        if (ii >= 0 && ii <= gemRow.length - 1) {
                            br = this.gemRows[i + 1].getAt(ii + 1);
                        }

                        let bottomLeftIsClear = bl instanceof NullGem || bl instanceof Attractor;
                        let bottomRightIsClear = br instanceof NullGem || br instanceof Attractor;

                        if (bottomLeftIsClear || bottomRightIsClear) {
                            gemsFell = true;
                        }

                        if (bottomLeftIsClear && bottomRightIsClear) {

                            if (rand === 1) { //can be 0 or 1
                                //go left
                                console.log(`${i}, ${ii} can go left to ${i + 1},${ii} a`);
                                this.moveGem(i, ii, i + 1, ii);
                            } else {
                                //go right
                                console.log(`${i}, ${ii} can go right to ${i + 1},${ii + 1} a`);
                                this.moveGem(i, ii, i + 1, ii + 1);
                            }

                        } else if (bottomLeftIsClear) {
                            //go left
                            console.log(`${i}, ${ii} can go left to ${i + 1},${ii} b`);
                            this.moveGem(i, ii, i + 1, ii);
                        } else if (bottomRightIsClear) {
                            //go right
                            console.log(`${i}, ${ii} can go right to ${i + 1},${ii + 1} b`);
                            this.moveGem(i, ii, i + 1, ii + 1);
                        }
                    }
                }
            })
        }


        if (gemsFell) {
            this.postChangeCheck();
        }

    }

    _isEquivalent(a, b) {
        // Create arrays of property names
        let aProps = Object.getOwnPropertyNames(a);
        let bProps = Object.getOwnPropertyNames(b);

        // If number of properties is different,
        // objects are not equivalent
        if (aProps.length !== bProps.length) {
            return false;
        }

        for (let i = 0; i < aProps.length; i++) {
            let propName = aProps[i];

            // If values of same property are not equal,
            // objects are not equivalent
            if (a[propName] !== b[propName]) {
                return false;
            }
        }

        // If we made it this far, objects
        // are considered equivalent
        return true;
    }

    checkMatch() {
        let self = this;
        let toDelete = [];

        this.gemRows.map((gemRow, i) => {
            let ii = -1;
            gemRow.forEachAlive(gem => {
                ii++;

                if (gem instanceof Gem) { //is a gem

                    let testedLocal = [];
                    let touchingLocal = [];

                    function checkGemSiblings(y, x) {

                        let toCheck = [];
                        if (self.gemRows[y - 1]) {
                            // //check above'left
                            toCheck.push({y: y - 1, x: x - 1});
                            // //check above'right
                            toCheck.push({y: y - 1, x});
                        }
                        if (self.gemRows[i + 1]) {
                            // //check below'left
                            toCheck.push({y: y + 1, x});
                            // //check below'right
                            toCheck.push({y: y + 1, x: x + 1});
                        }


                        toCheck.map(tc => {

                            if (self.gemRows[tc.y]) {
                                let gemToTest = self.gemRows[tc.y].getAt(tc.x);
                                if (gemToTest) { //not null

                                    const filterdToDelete = toDelete.filter(t => {
                                        return t.x === tc.x && t.y === tc.y;
                                    });
                                    const filterdTested = touchingLocal.filter(t => {
                                        return t.x === tc.x && t.y === tc.y;
                                    });

                                    if (filterdToDelete.length === 0) {
                                        if (filterdTested.length === 0) {

                                            testedLocal.push({y: tc.y, x: tc.x});

                                            if (gemToTest instanceof Gem) { //is a gem
                                                if (gemToTest.key === gem.key) { //same type of gem
                                                    // console.log('touching');
                                                    touchingLocal.push({y: tc.y, x: tc.x});
                                                    checkGemSiblings(tc.y, tc.x);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        });


                    }

                    checkGemSiblings(i, ii); //kick it off


                    if (touchingLocal.length >= 3) {
                        toDelete = toDelete.concat(touchingLocal);
                        console.log('added to the deletion pile', toDelete);
                    }


                }


            });
        });
        this.destroyGemsByPositions(toDelete);
    }

    addGemExplosion(gem) {
        let killerEmitter = game.add.emitter(gem.x, gem.y, 100);
        killerEmitter.makeParticles(gem.key);
        killerEmitter.setYSpeed(100, 300);
        killerEmitter.setXSpeed(-50, 50);
        killerEmitter.minRotation = 10;
        killerEmitter.maxRotation = 50;
        killerEmitter.setScale(0.1, 0.3, 0.1, 0.3);
        // killerEmitter.setAlpha(1, 0, 3000);
        // killerEmitter.setScale(game.SCALE * 0.4, 0, game.SCALE * 0.4, 0, 1000);
        killerEmitter.start(true, 4000, null, 10);

        function destroyEmitter() {
            killerEmitter.destroy();
        }

        game.time.events.add(5000, destroyEmitter, this);
    }

    flyGemToScore(gem) {
        return game.add.tween(gem).to({y: 0, x: game.world.centerX}, 1000, Phaser.Easing.Linear.None, true);
    }

    destroyGemsByPositions(positions) {

        console.log('to destroy', positions);

        positions.map(g => {

            let gem = this.gemRows[g.y].getAt(g.x);
            // console.log('destroying', g, gem.key);


            this.gemRows[g.y].replace(gem, new NullGem(this.game, 0, 0));

            // console.log('in place', this.gemRows[g.y].getAt(g.x));

            // console.log('DEBUG', this.gemRows[3].getAt(3));

            //EFFECT 1
            // this.flyGemToScore(gem)
            //     .onComplete.add(function () {
            //     gem.destroy();
            //     self.gemRows[g.y][g.x] = null;
            // this.updateAttractors();//TODO would prefer not to check twice
            // }, this);
            // .onCompleteCallback(function () {
            //     gem.destroy();
            //     self.gemRows[g.y][g.x] = null;
            // })
            //EFFECT 2
            this.addGemExplosion(gem);
            // gem.destroy(); //TODO not sure this is a good idea
            // self.gemRows[g.y][g.x] = null;

            // console.log(gem);
            // gem.destroy();
            // this.gemRows[g.y][g.x] = null;


            //update score
            this.game.updateScore(this.game.score_gem_exploded);

            this.cleanupDeadGems();
        });

    }

    updateAttractors() {
        console.log('update attractors');
        this.gemRows.map((gemRow, i) => {
            let ii = -1;
            gemRow.forEachAlive(gem => {
                ii++;

                if (!(gem instanceof Gem)) {


                    if (gem instanceof NullGem) { //its null

                        //check the 2 under
                        if (this.gemRows[i + 1]) { //row under exists (not bottom row)
                            if (this.gemRows[i + 1].getAt(ii) instanceof Gem && this.gemRows[i + 1].getAt(ii + 1) instanceof Gem) {
                                this.gemRows[i].replace(gem, new Attractor(this.game, 200, 200));
                            } else {
                                //reset it
                                this.gemRows[i].replace(gem, new NullGem(this.game, 200, 200));
                            }
                        } else {
                            this.gemRows[i].replace(gem, new Attractor(this.game, 200, 200));
                        }

                    }
                }

            })
        });
    }

    updateGemPositions() {
        this.gemRows.slice(0).reverse().map((gemRow, i) => {
            let ii = -1;
            gemRow.forEachAlive(gem => {
                ii++;

                if (gem) {
                    const startX = this.x - (this.width / 2) + (gem.width / 2);
                    const marginLeft = (this.maxGemRowSize - gemRow.length) * (gem.width / 2);
                    const x = startX + marginLeft + (ii * gem.width);
                    const startY = this.y;
                    const y = startY - (this.height / 2) - ((gem.height / 2) * i);
                    gem.position.set(x, y);
                }
            })
        });
    }

    update() {

        // console.log(this.gemRows[3].getAt(3).key);
        this.updateGemPositions();


        // }

        //update emitters
        this.fireEmitter.emitX = this.x;
        this.fireEmitter.emitY = this.y + 40;
        this.smokeEmitter.emitX = this.x;
        this.smokeEmitter.emitY = this.y + 40;

    }

}


/*
 -----[]
 ----[][]
 ---[][][]
 --[][][][]
 -[][][][][]
 */
