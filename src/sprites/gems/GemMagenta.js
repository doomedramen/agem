import Gem from './Gem';

export default class extends Gem {
    // static Preload(game) {
    //     game.load.image('gem-magenta', 'assets/img/gem-magenta.png');
    // }

    constructor(game, x, y) {
        super(game, x, y, 'gem-magenta');
    }


}