"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamePage = exports.MAX_STEP_LEN = exports.PLAYER_SIZE = exports.FIELD_POS = exports.STEP_FIELD_HIGH = exports.STEP_FIELD_WIDTH = exports.brown = void 0;
//@ts-ignore
const createjs_module_1 = require("createjs-module");
const Main_1 = require("./Main");
const Player_1 = require("./Player");
const stepField_1 = require("./stepField");
const GameTimer_1 = require("./GameTimer");
const EventEmitter_1 = require("./module/EventEmitter");
exports.brown = '#965042';
exports.STEP_FIELD_WIDTH = 70;
exports.STEP_FIELD_HIGH = 20;
exports.FIELD_POS = { x: 90, y: 370 };
exports.PLAYER_SIZE = 20;
exports.MAX_STEP_LEN = 10;
class GamePage extends createjs_module_1.Container {
    //  背景
    _bg = new createjs_module_1.Shape();
    _bgColor;
    _canvas;
    gameStage;
    _stepField;
    _stepList = [];
    _timer;
    playerManager;
    _isInit = true;
    timerUI = document.getElementById('timer');
    constructor(canvas, bgColor) {
        super();
        this._canvas = canvas;
        this.gameStage = new createjs_module_1.Stage(this._canvas);
        this._bgColor = bgColor;
        this._stepField = new stepField_1.StepField(this.gameStage, this._stepList, this._isInit);
        this._timer = new GameTimer_1.GameTimer(60);
        this.playerManager = new Player_1.Player(this.gameStage, this._stepList, this._stepField, this._timer);
        EventEmitter_1.EventEmitter.getInstance().addEventLister('GameOver', this.gameEnd);
    }
    init = () => {
        this._stepList = [];
        this._bg.graphics.beginFill(this._bgColor).drawRect(0, 0, 640, 480);
        this.gameStage.addChild(this._bg);
        this._stepField.setStepField();
        this._isInit = false;
        this.playerManager.init();
        this.gameStage.update();
    };
    run() {
        this.playerManager.run();
        EventEmitter_1.EventEmitter.getInstance().addEventLister('Tick', () => {
            window.console.log('今', this._timer.getTimeLeft());
            if (this.timerUI.textContent) {
                this.timerUI.textContent = `残り ${this._timer.getTimeLeft()}秒です`;
            }
        });
        this._timer.start();
    }
    _timeOutAsync = async (time) => {
        const timer = () => new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(resolve);
            }, time);
        });
        return timer();
    };
    gameEnd = async () => {
        window.console.log('時間切れ');
        this.playerManager.removeClickEvent();
        await this._timeOutAsync(1000);
        this.playerManager.destroy();
        (0, Main_1.showResultScreen)(this.playerManager._totalDistance);
    };
    startTicker = () => {
        createjs_module_1.Ticker.framerate = 60;
        createjs_module_1.Ticker.addEventListener('tick', this._tick);
    };
    _tick = () => {
        this.gameStage.update();
    };
}
exports.GamePage = GamePage;
