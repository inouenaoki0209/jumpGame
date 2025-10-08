"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showResultScreen = void 0;
const GamePage_1 = require("./GamePage");
const TopPage_1 = require("./TopPage");
const green = '#3eb370';
const navy = '#043ab9';
const blue = '#0095d9';
const colorObj = {
    green: green, navy: navy, blue: blue
};
const canvas = document.getElementById('game');
const startScreen = document.getElementById('start-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('startBtn');
const retryBtn = document.getElementById('retryBtn');
const finalDistanceText = document.getElementById('finalDistance');
const gameUi = document.getElementById('game-ui');
const color = colorObj.green;
const game = new GamePage_1.GamePage(canvas, color);
const top = new TopPage_1.TopPage(canvas);
top.init();
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
function showResultScreen(totalDistance) {
    gameUi.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    finalDistanceText.textContent = `最終到達距離: ${totalDistance} M`;
}
exports.showResultScreen = showResultScreen;
// リトライ処理（リセット）
retryBtn.addEventListener('click', () => {
    resultScreen.classList.add('hidden');
    location.reload(); // ページ再読み込みで状態初期化
});
