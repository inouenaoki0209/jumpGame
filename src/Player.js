"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const createjs_module_1 = require("createjs-module");
const GamePage_1 = require("./GamePage");
class Player {
    _player = new createjs_module_1.Shape();
    _playerContainer = new createjs_module_1.Container();
    _stage;
    _stepList;
    _stepField;
    _oneJumpBtn = document.getElementById('oneStepBtn');
    _twoJumpBtn = document.getElementById('twoStepBtn');
    _timer;
    _totalDistance = 0;
    _totalDistanceText = document.getElementById('totalDistance');
    constructor(stage, stepList, stepField, timer) {
        this._stage = stage;
        this._stepList = stepList;
        this._stepField = stepField;
        this._timer = timer;
    }
    init() {
        this._player.graphics.beginFill('yellow').drawCircle(0, 0, GamePage_1.PLAYER_SIZE);
        this._playerContainer.addChild(this._player);
        this._stage.addChild(this._playerContainer);
        this._playerContainer.set({
            x: GamePage_1.FIELD_POS.x + GamePage_1.STEP_FIELD_WIDTH / 2 + 10,
            y: GamePage_1.FIELD_POS.y + -GamePage_1.STEP_FIELD_HIGH
        });
    }
    removeClickEvent() {
        this.disAbleBtnClick();
        this._oneJumpBtn.removeEventListener('click', this.oneJumpClick);
        this._twoJumpBtn.removeEventListener('click', this.twoJumpClick);
    }
    run = () => {
        this.playerJumpEvent();
    };
    disAbleBtnClick = () => {
        this._oneJumpBtn.disabled = true;
        this._twoJumpBtn.disabled = true;
    };
    permitBtnClick = () => {
        this._oneJumpBtn.disabled = false;
        this._twoJumpBtn.disabled = false;
    };
    jumpAfter = () => {
        createjs_module_1.Tween.removeTweens(this._playerContainer);
        if (this._stepList[1].state === 'enemy') {
            if (this._stepList[1].addItem) {
                this._stepList[1].step.removeChild(this._stepList[1].addItem);
                setTimeout(() => {
                    this.permitBtnClick();
                }, 2000);
            }
            else {
                throw Error('トラップがないような');
            }
        }
        else if (this._stepList[1].state === 'item') {
            //            お助けアイテム獲得
            if (this._stepList[1].addItem) {
                this._stepList[1].step.removeChild(this._stepList[1].addItem);
            }
            //            3秒追加
            this._timer.addTime(3);
            this.permitBtnClick();
        }
        else {
            this.permitBtnClick();
        }
    };
    oneJumpClick = () => {
        this.disAbleBtnClick();
        this.moveField();
        createjs_module_1.Tween.get(this._playerContainer)
            .to({ x: this._playerContainer.x - 10 }, 100)
            .to({ y: this._playerContainer.y - GamePage_1.STEP_FIELD_HIGH * 5 }, 200, createjs_module_1.Ease.cubicInOut)
            .to({ x: this._playerContainer.x, y: GamePage_1.FIELD_POS.y + -GamePage_1.STEP_FIELD_HIGH }, 350, createjs_module_1.Ease.cubicIn)
            .call(() => {
            this.jumpAfter();
            this._totalDistance += 1;
            if (this._totalDistanceText.textContent) {
                this._totalDistanceText.textContent = `現在 : ${this._totalDistance} M`;
            }
        });
    };
    twoJumpClick = () => {
        this.disAbleBtnClick();
        this.twiceMoveField();
        createjs_module_1.Tween.get(this._playerContainer)
            .to({ x: this._playerContainer.x - 10 }, 100)
            .to({ y: this._playerContainer.y - GamePage_1.STEP_FIELD_HIGH * 5 }, 200, createjs_module_1.Ease.cubicInOut)
            .to({ x: this._playerContainer.x, y: GamePage_1.FIELD_POS.y + -GamePage_1.STEP_FIELD_HIGH }, 350, createjs_module_1.Ease.cubicIn)
            .call(() => {
            this.jumpAfter();
            this._totalDistance += 2;
            if (this._totalDistanceText.textContent) {
                this._totalDistanceText.textContent = `現在 : ${this._totalDistance} M`;
            }
        });
    };
    playerJumpEvent = () => {
        this._oneJumpBtn.addEventListener('click', this.oneJumpClick);
        this._twoJumpBtn.addEventListener('click', this.twoJumpClick);
    };
    /**
     * プレイヤージャンプ
     * 一段とび/二段とび
     */
    //    一段とび
    moveField = () => {
        this._stepList.forEach((v, i) => {
            createjs_module_1.Tween.get(v.step)
                .to({ x: v.step.x - GamePage_1.FIELD_POS.x }, 600)
                .call(() => {
                this.reCreateStep(i);
            });
        });
    };
    //    二段とび
    twiceMoveField = () => {
        this._stepList.forEach((v, i) => {
            createjs_module_1.Tween.get(v.step)
                .to({ x: v.step.x - GamePage_1.FIELD_POS.x * 2 }, 600)
                .call(() => {
                this.reCreateStep(i);
                this.reCreateStep(i);
                if (i == this._stepList.length - 1) {
                    this._stepList[this._stepList.length - 2].step.x -= GamePage_1.FIELD_POS.x;
                }
            });
        });
    };
    // 跳躍後の足場生成
    reCreateStep = (i) => {
        if (i === this._stepList.length - 1) {
            const fadeOutStep = this._stepList[0];
            this._stepList.shift();
            this._stepField.setStepField();
            this._stage.removeChild(fadeOutStep.step);
        }
    };
    destroy = () => {
        this._playerContainer.removeChild(this._player);
        this._stage.removeAllChildren();
    };
}
exports.Player = Player;
