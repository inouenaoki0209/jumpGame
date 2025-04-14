import {GamePage} from './GamePage';
const canvas  = document.getElementById('game') as HTMLCanvasElement;
const game = new GamePage(canvas);

game.startTicker();
game.init();
game.run();
