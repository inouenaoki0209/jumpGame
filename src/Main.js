"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GamePage_1 = require("./GamePage");
var green = '#3eb370';
var navy = '#043ab9';
var blue = '#0095d9';
var colorObj = {
    green: green, navy: navy, blue: blue
};
var canvas = document.getElementById('game');
var color = colorObj.green;
var game = new GamePage_1.GamePage(canvas, color);
game.startTicker();
game.init();
game.run();
