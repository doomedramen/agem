import Phaser from 'phaser';
import Gem from './gems/Gem';
import Attractor from './Attractor';

export default class extends Phaser.Sprite {

    static Preload(game) {

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
            let gemSet = [];
            for (let ii = 0; ii < i; ii++) {
                gemSet.push(null);
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
                gemRow.map((attractor, ii) => {
                    if (!collision) {
                        if (attractor instanceof Attractor) {
                            const boundsB = attractor.getBounds();
                            if (Phaser.Rectangle.intersects(this.scaleBounds(boundsA, 0.5), this.scaleBounds(boundsB, 0.5))) {
                                collision = true;
                                this.addGem(gem, i, ii);
                            }
                        }
                    }
                })
            }
        });
        return collision;

    }

    moveGem(y, x, yy, xx) {
        this.gemRows[yy][xx] = this.gemRows[y][x];
        this.gemRows[y][x] = null;
    }

    postChangeCheck() {

        this.checkMatch();
        this.checkIfFull();
        this.updateAttractors();
    }

    addGem(gem, i, ii) {

        if (this.gemRows[i][ii]) {
            if (this.gemRows[i][ii] instanceof Gem || this.gemRows[i][ii] instanceof Attractor) {
                this.gemRows[i][ii].destroy();
                this.gemRows[i][ii] = gem;
                this.game.add.existing(gem);
                this.game.updateScore(this.game.score_gem_collected);
            }
        }
        this.postChangeCheck();

    }

    checkIfFull() {
        let full = true;
        this.gemRows.map((gemRow, i) => {
            gemRow.map((gem) => {
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

    checkGemGravity() {

        // let gemsFell = false;
        //
        // for (let i = this.gemRows.length - 1; i >= 0; i--) {
        //
        //     let gemRow = this.gemRows[i];
        //
        //     gemRow.map((gem, ii) => {
        //
        //         let rand = Math.round(Math.random());
        //         if (this.gemRows[i + 1]) {
        //
        //             //check below left
        //             let bl = undefined;
        //             if (ii > 0 && ii < gemRow.length - 1) {
        //                 bl = this.gemRows[i + 1][ii];
        //             }
        //
        //             //check below right
        //             let br = undefined;
        //             if (ii > 0 && ii < gemRow.length - 1) {
        //                 br = this.gemRows[i + 1][ii + 1];
        //             }
        //
        //             if (!bl || !br) {
        //                 gemsFell = true;
        //             }
        //
        //             if (!bl && !br) {
        //
        //                 if (rand === 1) { //can be 0 or 1
        //                     //go left
        //                     this.moveGem(i, ii, i + 1, ii);
        //                 } else {
        //                     //go right
        //                     this.moveGem(i, ii, i + 1, ii + 1);
        //                 }
        //
        //             } else if (!bl) {
        //                 //go left
        //                 this.moveGem(i, ii, i + 1, ii);
        //             } else if (!br) {
        //                 //go right
        //                 this.moveGem(i, ii, i + 1, ii + 1);
        //             }
        //         }
        //     })
        // }
        //
        //
        // if (gemsFell) {
        //     this.postChangeCheck();
        // }

    }

    checkMatch() {
        let self = this;

        let touching = [];

        this.gemRows.map((gemRow, i) => {
            gemRow.map((gem, ii) => {


                if (gem) { //not null

                    if (gem instanceof Gem) { //is a gem

                        let currentSearch = [];

                        function checkSibling(y, x) {
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

                            let currentGem = self.gemRows[y][x];
                            toCheck.map(tc => {

                                if (self.gemRows[tc.y]) {

                                    let gcGem = self.gemRows[tc.y][tc.x];

                                    if (gcGem) { //not null
                                        if (gcGem.key === currentGem.key) {


                                            const filterd = touching.filter(t => {
                                                return t.x === tc.x && t.y === tc.y;
                                            });


                                            //TODO filter not idea
                                            if (filterd.length <= 0) {


                                                touching.push({y: tc.y, x: tc.x});
                                                currentSearch.push({y: tc.y, x: tc.x});
                                                checkSibling(tc.y, tc.x);

                                            }


                                        }
                                    }
                                }
                            })
                        }

                        checkSibling(i, ii);


                        // console.log(currentSearch.length, 'touching');
                        if (currentSearch.length >= 3) {
                            // console.log('EXPLODE THEM!!!');

                            this.destroyGemsByPositions(currentSearch);

                        }
                    } else {
                        // console.log('not a gem');
                    }

                }

            });
        });
    }

    addGemExplosion(gem) {
        let killerEmitter = game.add.emitter(gem.x, gem.y, 100);
        killerEmitter.makeParticles(gem.getName());
        killerEmitter.setYSpeed(100, 300);
        killerEmitter.setXSpeed(-50, 50);
        killerEmitter.minRotation = 10;
        killerEmitter.maxRotation = 50;
        killerEmitter.setScale(0.4, 0.5, 0.4, 0.5);
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

        positions.map(g => {
            let gem = this.gemRows[g.y][g.x];
            const self = this;

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
            gem.destroy();
            self.gemRows[g.y][g.x] = null;

            // console.log(gem);
            // gem.destroy();
            // this.gemRows[g.y][g.x] = null;


            //update score
            this.game.updateScore(this.game.score_gem_exploded);
        });

        //TODO
        this.checkGemGravity();
        this.updateAttractors();
    }

    updateAttractors() {
        this.gemRows.map((gemRow, i) => {
            gemRow.map((gem, ii) => {

                if (!gem) { //its null

                    if (gem instanceof Attractor) {
                        this.gemRows[i][ii] = null; //reset it
                    }

                    //check the 2 under
                    if (this.gemRows[i + 1]) { //row under exists (not bottom row)

                        if (this.gemRows[i + 1][ii] instanceof Gem && this.gemRows[i + 1][ii + 1] instanceof Gem) {
                            //needs to be an attractor
                            // console.log('making an attractor');
                            this.gemRows[i][ii] = new Attractor(this.game, 200, 200);
                            this.game.add.existing(this.gemRows[i][ii]);
                        }

                    } else {
                        //this is the bottom row! so make it an attractor
                        // console.log('making an attractor');
                        this.gemRows[i][ii] = new Attractor(this.game, 200, 200);
                        this.game.add.existing(this.gemRows[i][ii]);
                    }

                }


            })
        });
        // console.log(this.gemRows);
    }

    update() {

        // if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
        //     this.gemRows.map(row => {
        //         row.map(gem => {
        //             if (gem instanceof Gem) {
        //                 this.addGemExplosion(gem);
        //             }
        //         })
        //     })
        // }

        this.gemRows.slice(0).reverse().map((gemRow, i) => {
            // for (let i = 0 ; i < 0; i--) {
            // for (let i = this.gemRows.length - 1; i >= 0; i--) {
            // this.gemRows.map((gemRow, i) => {
            // let gemRow = this.gemRows[i];


            gemRow.map((gem, ii) => {

                if (gem) {
                    const startX = this.x - (this.width / 2) + (gem.width / 2);
                    const marginLeft = (this.maxGemRowSize - gemRow.length) * (gem.width / 2);
                    const x = startX + marginLeft + (ii * gem.width);
                    const startY = this.y;
                    const y = startY - (this.height / 2) - ((gem.height / 2) * i);
                    gem.position.set(x, y);

                    // console.log(x, y);
                    // console.log(this.x, this.y);
                }
            })
        });
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
