"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamePage = void 0;
//@ts-ignore
const createjs_module_1 = require("createjs-module");
const RandMarker_1 = require("./RandMarker");
class GamePage extends createjs_module_1.Container {
    constructor(canvas) {
        super();
        this.STEP_FIELD_WIDTH = 70;
        this.STEP_FIELD_HIGH = 20;
        this.PLAYER_SIZE = 20;
        this.FIELD_POS = { x: 90, y: 370 };
        this.MAX_STEP_LEN = 9;
        //  背景
        this._bg = new createjs_module_1.Shape();
        this._stepList = [];
        this._player = new createjs_module_1.Shape();
        this._playerContainer = new createjs_module_1.Container();
        this._oneJumpBtn = document.getElementById('oneStepBtn');
        this._twoJumpBtn = document.getElementById('twoStepBtn');
        //    ステップが穴あきならtrue;
        this._isBlankStep = false;
        this.STEP_COLOR = 'brown';
        this._isInit = true;
        this.init = () => {
            this._stepList = [];
            this._bg.graphics.beginFill('green').drawRect(0, 0, 640, 480);
            this._player.graphics.beginFill('yellow').drawCircle(0, 0, this.PLAYER_SIZE);
            this._playerContainer.addChild(this._player);
            this.gameStage.addChild(this._bg);
            this.setStepField();
            this._isInit = false;
            this.gameStage.addChild(this._playerContainer);
            this._playerContainer.set({
                x: this.FIELD_POS.x + this.STEP_FIELD_WIDTH / 2 + 10,
                y: this.FIELD_POS.y + -this.STEP_FIELD_HIGH
            });
            this.gameStage.update();
        };
        this.startTicker = () => {
            createjs_module_1.Ticker.framerate = 60;
            createjs_module_1.Ticker.addEventListener('tick', this._tick);
        };
        this._tick = () => {
            this.gameStage.update();
        };
        // stepFieldを作成
        this.createStepField = (index) => {
            const stepContainer = new createjs_module_1.Container();
            const stepField = new createjs_module_1.Shape();
            const createBlankStep = () => {
                // ランダム値が0なら空白stepを作成
                if (!(0, RandMarker_1.stepColorChoiceRand)()) {
                    // boolがすでにtrue(直前が空白)ならstep有を返す
                    if (this._isBlankStep) {
                        this._isBlankStep = false;
                        return 'brown';
                    }
                    else {
                        // 初期位置を穴あきにさせない
                        if (this._isInit && index === 1) {
                            this._isBlankStep = false;
                            return 'brown';
                        }
                        else {
                            this._isBlankStep = true;
                            return 'green';
                        }
                    }
                }
                else {
                    this._isBlankStep = false;
                    return 'brown';
                }
            };
            this.STEP_COLOR = createBlankStep();
            stepField.graphics.beginFill(this.STEP_COLOR).drawRect(0, 0, this.STEP_FIELD_WIDTH, this.STEP_FIELD_HIGH);
            stepContainer.addChild(stepField);
            this.gameStage.addChild(stepContainer);
            if (this.STEP_COLOR === 'brown') {
                this._stepList.push({ step: stepContainer, isAshiba: true });
            }
            else if (this.STEP_COLOR === 'green') {
                if (this._isInit && index === 1) {
                    this._stepList.push({ step: stepContainer, isAshiba: true });
                }
                else {
                    this._stepList.push({ step: stepContainer, isAshiba: false });
                }
            }
            this._stepList[index].step.y = this.FIELD_POS.y;
            this._stepList[index].step.x = this.FIELD_POS.x * index + 10;
        };
        this.setStepField = () => {
            while (this._stepList.length < this.MAX_STEP_LEN) {
                const index = this._stepList.length;
                this.createStepField(index);
            }
        };
        /**
         * プレイヤージャンプ
         * 一段とび/二段とび
         */
        this.playerJumpEvent = () => {
            this._oneJumpBtn.addEventListener('click', () => {
                this._oneJumpBtn.disabled = true;
                this.moveField();
                window.console.log(this._stepList);
                createjs_module_1.Tween.get(this._playerContainer)
                    .to({ x: this._playerContainer.x - 10 }, 100)
                    .to({ y: this._playerContainer.y - this.STEP_FIELD_HIGH * 5 }, 200, createjs_module_1.Ease.cubicInOut)
                    .to({ x: this._playerContainer.x, y: this.FIELD_POS.y + -this.STEP_FIELD_HIGH }, 350, createjs_module_1.Ease.cubicIn)
                    .call(() => {
                    createjs_module_1.Tween.removeTweens(this._playerContainer);
                    if (!this._stepList[1].isAshiba) {
                        createjs_module_1.Tween.get(this._playerContainer)
                            .to({ y: 600 }, 400);
                    }
                    else {
                        this._oneJumpBtn.disabled = false;
                    }
                });
            });
            this._twoJumpBtn.addEventListener('click', () => {
                this._twoJumpBtn.disabled = true;
                this.twiceMoveField();
                window.console.log(this._stepList);
                createjs_module_1.Tween.get(this._playerContainer)
                    .to({ x: this._playerContainer.x - 10 }, 100)
                    .to({ y: this._playerContainer.y - this.STEP_FIELD_HIGH * 5 }, 200, createjs_module_1.Ease.cubicInOut)
                    .to({ x: this._playerContainer.x, y: this.FIELD_POS.y + -this.STEP_FIELD_HIGH }, 350, createjs_module_1.Ease.cubicIn)
                    .call(() => {
                    createjs_module_1.Tween.removeTweens(this._playerContainer);
                    if (!this._stepList[1].isAshiba) {
                        createjs_module_1.Tween.get(this._playerContainer)
                            .to({ y: 600 }, 400);
                    }
                    else {
                        this._twoJumpBtn.disabled = false;
                    }
                });
            });
        };
        // 跳躍後の足場生成
        this.reCreateStep = (i) => {
            if (i === this._stepList.length - 1) {
                const fadeOutStep = this._stepList[0];
                this._stepList.shift();
                this.setStepField();
                this.gameStage.removeChild(fadeOutStep.step);
            }
        };
        //    一段とび
        this.moveField = () => {
            this._stepList.forEach((v, i) => {
                createjs_module_1.Tween.get(v.step)
                    .to({ x: v.step.x - this.FIELD_POS.x }, 600)
                    .call(() => {
                    this.reCreateStep(i);
                });
            });
        };
        //    二段とび
        this.twiceMoveField = () => {
            this._stepList.forEach((v, i) => {
                createjs_module_1.Tween.get(v.step)
                    .to({ x: v.step.x - this.FIELD_POS.x * 2 }, 600)
                    .call(() => {
                    this.reCreateStep(i);
                    this.reCreateStep(i);
                    if (i == this._stepList.length - 1) {
                        this._stepList[this._stepList.length - 2].step.x -= this.FIELD_POS.x;
                    }
                });
            });
        };
        this._canvas = canvas;
        this.gameStage = new createjs_module_1.Stage(this._canvas);
    }
    run() {
        window.console.log('game開始');
        this.playerJumpEvent();
    }
}
exports.GamePage = GamePage;
