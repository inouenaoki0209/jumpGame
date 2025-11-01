import {GamePage} from './GamePage';
import {TopPage} from './TopPage';

const green = '#3eb370';
const navy = '#043ab9';
const blue = '#0095d9';
export type coloType = { green: string, blue: string, navy: string };
const colorObj: coloType = {
    green: green, navy: navy, blue: blue
}
const baseContainer = new createjs.Container();
// 型の修正
const canvas = document.getElementById('game') as HTMLCanvasElement;
const startScreen = document.getElementById('start-screen') as HTMLElement; // ← div
const resultScreen = document.getElementById('result-screen') as HTMLElement;
const startBtn = document.getElementById('startBtn') as HTMLButtonElement;
const retryBtn = document.getElementById('retryBtn') as HTMLButtonElement;
const finalDistanceText = document.getElementById('finalDistance') as HTMLElement;
const gameUi = document.getElementById('game-ui') as HTMLElement;      // ← div
const color = colorObj.green;

const stage = new createjs.Stage(canvas);

stage.addChild(baseContainer);

const top = new TopPage();
const game = new GamePage(canvas, color);

baseContainer.addChild(top);
game.visible = false;

const promise = async () => {
    await top.init();
    stage.update();
}
promise();

startBtn.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    game.visible = true;

    game.startTicker();
    game.init();
    game.run();

    stage.update();
});

// リザルト表示関数
export function showResultScreen(totalDistance: number) {
    gameUi.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    finalDistanceText.textContent = `最終到達距離: ${totalDistance} M`;
}

// リトライ
retryBtn.addEventListener('click', () => {
    resultScreen.classList.add('hidden');
    location.reload();
});
