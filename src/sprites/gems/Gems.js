import GemBlue from './GemBlue';
import GemMagenta from './GemMagenta';
import GemGreen from './GemGreen';
import GemOrange from './GemOrange';

export default class {

    static Preload(game) {
        game.load.image('gem-blue', 'assets/img/gem-blue.png');
        game.load.image('gem-green', 'assets/img/gem-green.png');
        game.load.image('gem-magenta', 'assets/img/gem-magenta.png');
        game.load.image('gem-orange', 'assets/img/gem-orange.png');
        game.load.image('gem-null', 'assets/img/gem-null.png');
    }

    static RandomGem() {
        // const gemList = [GemOrange, GemBlue, GemMagenta, GemGreen];
        const gemList = [GemOrange, GemBlue];
        return gemList[Math.floor(Math.random() * gemList.length)];
    }

    static DEBUG_GEM() {
        return GemBlue;
    }

}
