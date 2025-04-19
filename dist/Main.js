import { GamePage } from './GamePage';
const green = '#3eb370';
const navy = '#043ab9';
const blue = '#0095d9';
const colorObj = {
    green: green, navy: navy, blue: blue
};
const canvas = document.getElementById('game');
const color = colorObj.green;
const game = new GamePage(canvas, color);
game.startTicker();
game.init();
game.run();
