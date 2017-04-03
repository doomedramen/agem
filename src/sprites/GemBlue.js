import Gem from './Gem';

export default class extends Gem {
    static Preload(game) {
        game.load.image('gem-blue', 'assets/img/gem-blue.png');
    }

    constructor(game, x, y) {
        super(game, x, y, 'gem-blue');
    }
}