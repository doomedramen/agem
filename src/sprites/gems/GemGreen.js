import Gem from './Gem';

export default class extends Gem {
    // static Preload(game) {
    //     game.load.image('gem-green', 'assets/img/gem-green.png');
    // }

    constructor(game, x, y) {
        super(game, x, y, 'gem-green');
    }


}