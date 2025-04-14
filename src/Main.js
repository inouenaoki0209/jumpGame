"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GamePage_1 = require("./GamePage");
const canvas = document.getElementById('game');
const game = new GamePage_1.GamePage(canvas);
game.startTicker();
game.init();
game.run();
