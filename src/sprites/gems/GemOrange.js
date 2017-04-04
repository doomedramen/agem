import Gem from './Gem';

export default class extends Gem {
    // static Preload(game) {
    //     game.load.image('gem-orange', 'assets/img/gem-orange.png');
    // }

    constructor(game, x, y) {
        super(game, x, y, 'gem-orange');
    }

}