import {GamePage} from './GamePage';
import {TopPage} from './TopPage';

const green ='#3eb370';
const navy ='#043ab9';
const blue ='#0095d9';
export type coloType = {green: string, blue: string,navy: string};
const colorObj:coloType = {
    green:green,navy:navy,blue:blue
}
const canvas = document.getElementById('game') as HTMLCanvasElement;
const startScreen = document.getElementById('start-screen')!;
const resultScreen = document.getElementById('result-screen')!;
const startBtn = document.getElementById('startBtn') as HTMLButtonElement;
const retryBtn = document.getElementById('retryBtn') as HTMLButtonElement;
const finalDistanceText = document.getElementById('finalDistance')!;
const gameUi = document.getElementById('game-ui') as HTMLCanvasElement;
const color = colorObj.green;
const game = new GamePage(canvas,color);
const top = new TopPage(canvas);
top.init()
/**
 * debug
 * スタート画面をスキップ
 */
//startScreen.classList.add('hidden');
//gameUi.classList.remove('hidden');
// スタートボタン処理
startBtn.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    gameUi.classList.remove('hidden');
    game.startTicker();
    game.init();
    game.run();
});

// ゲーム終了時の呼び出し関数（GamePage内からコール）
export function showResultScreen(totalDistance: number) {
    gameUi.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    finalDistanceText.textContent = `最終到達距離: ${totalDistance} M`;
}

// リトライ処理（リセット）
retryBtn.addEventListener('click', () => {
    resultScreen.classList.add('hidden');
    location.reload(); // ページ再読み込みで状態初期化
});
