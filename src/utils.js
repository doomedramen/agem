import config from './config'

export const centerGameObjects = (objects) => {
    objects.forEach(function (object) {
        object.anchor.setTo(0.5)
    })
};

// export const scaleGame = (game) => {
//     const docElement = document.documentElement;
//     const width = docElement.clientWidth > config.gameWidth ? config.gameWidth : docElement.clientWidth;
//     const height = docElement.clientHeight > config.gameHeight ? config.gameHeight : docElement.clientHeight;
//
//     game.scale.setGameSize(width, height);
//
// };

export const randomNumber = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
};
