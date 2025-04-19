"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamePage = void 0;
//@ts-ignore
var createjs_module_1 = require("createjs-module");
var RandMarker_1 = require("./RandMarker");
var brown = '#965042';
var red = '#FF0000';
var GamePage = /** @class */ (function (_super) {
    __extends(GamePage, _super);
    function GamePage(canvas, bgColor) {
        var _this = _super.call(this) || this;
        _this.STEP_FIELD_WIDTH = 70;
        _this.STEP_FIELD_HIGH = 20;
        _this.PLAYER_SIZE = 20;
        _this.FIELD_POS = { x: 90, y: 370 };
        _this.MAX_STEP_LEN = 9;
        //  背景
        _this._bg = new createjs_module_1.Shape();
        _this._stepList = [];
        _this._player = new createjs_module_1.Shape();
        _this._playerContainer = new createjs_module_1.Container();
        _this._oneJumpBtn = document.getElementById('oneStepBtn');
        _this._twoJumpBtn = document.getElementById('twoStepBtn');
        //    ステップが穴あきならtrue;
        _this._isBlankStep = false;
        _this.STEP_COLOR = '#965042';
        _this._isInit = true;
        _this.init = function () {
            _this._stepList = [];
            _this._bg.graphics.beginFill(_this._bgColor).drawRect(0, 0, 640, 480);
            _this._player.graphics.beginFill('yellow').drawCircle(0, 0, _this.PLAYER_SIZE);
            _this._playerContainer.addChild(_this._player);
            _this.gameStage.addChild(_this._bg);
            _this.setStepField();
            _this._isInit = false;
            _this.gameStage.addChild(_this._playerContainer);
            _this._playerContainer.set({
                x: _this.FIELD_POS.x + _this.STEP_FIELD_WIDTH / 2 + 10,
                y: _this.FIELD_POS.y + -_this.STEP_FIELD_HIGH
            });
            _this.gameStage.update();
        };
        _this.startTicker = function () {
            createjs_module_1.Ticker.framerate = 60;
            createjs_module_1.Ticker.addEventListener('tick', _this._tick);
        };
        _this._tick = function () {
            _this.gameStage.update();
        };
        // stepFieldを作成
        _this.createStepField = function (index) {
            var stepContainer = new createjs_module_1.Container();
            var stepField = new createjs_module_1.Shape();
            var enemy = new createjs_module_1.Shape();
            var createBlankStep = function () {
                // ランダム値が0なら空白stepを作成
                if (!(0, RandMarker_1.stepColorChoiceRand)()) {
                    // boolがすでにtrue(直前が空白)ならstep有を返す
                    if (_this._isBlankStep) {
                        _this._isBlankStep = false;
                        return brown;
                    }
                    else {
                        // 初期位置を穴あきにさせない
                        if (_this._isInit && index === 1) {
                            _this._isBlankStep = false;
                            return brown;
                        }
                        else {
                            _this._isBlankStep = true;
                            return red;
                        }
                    }
                }
                else {
                    _this._isBlankStep = false;
                    return brown;
                }
            };
            _this.STEP_COLOR = createBlankStep();
            stepField.graphics.beginFill(_this.STEP_COLOR).drawRect(0, 0, _this.STEP_FIELD_WIDTH, _this.STEP_FIELD_HIGH);
            enemy.graphics.beginFill('blue').drawCircle(0, 0, 15);
            stepContainer.addChild(stepField);
            _this.gameStage.addChild(stepContainer);
            if (_this.STEP_COLOR === brown) {
                _this._stepList.push({ step: stepContainer, isTrap: true });
            }
            else if (_this.STEP_COLOR === red) {
                if (_this._isInit && index === 1) {
                    _this._stepList.push({ step: stepContainer, isTrap: true });
                }
                else {
                    stepContainer.addChild(enemy);
                    enemy.set({ x: 35, y: -16 });
                    _this._stepList.push({ step: stepContainer, isTrap: false, enemy: enemy });
                }
            }
            _this._stepList[index].step.y = _this.FIELD_POS.y;
            _this._stepList[index].step.x = _this.FIELD_POS.x * index + 10;
        };
        _this.setStepField = function () {
            while (_this._stepList.length < _this.MAX_STEP_LEN) {
                var index = _this._stepList.length;
                _this.createStepField(index);
            }
        };
        /**
         * プレイヤージャンプ
         * 一段とび/二段とび
         */
        _this.playerJumpEvent = function () {
            _this._oneJumpBtn.addEventListener('click', function () {
                _this._oneJumpBtn.disabled = true;
                _this.moveField();
                window.console.log(_this._stepList);
                createjs_module_1.Tween.get(_this._playerContainer)
                    .to({ x: _this._playerContainer.x - 10 }, 100)
                    .to({ y: _this._playerContainer.y - _this.STEP_FIELD_HIGH * 5 }, 200, createjs_module_1.Ease.cubicInOut)
                    .to({ x: _this._playerContainer.x, y: _this.FIELD_POS.y + -_this.STEP_FIELD_HIGH }, 350, createjs_module_1.Ease.cubicIn)
                    .call(function () {
                    createjs_module_1.Tween.removeTweens(_this._playerContainer);
                    if (!_this._stepList[1].isTrap) {
                        if (_this._stepList[1].enemy) {
                            _this._stepList[1].step.removeChild(_this._stepList[1].enemy);
                            setTimeout(function () {
                                _this._oneJumpBtn.disabled = false;
                                _this._twoJumpBtn.disabled = false;
                            }, 2000);
                        }
                        else {
                            throw Error('トラップがないような');
                        }
                    }
                    else {
                        _this._oneJumpBtn.disabled = false;
                        _this._twoJumpBtn.disabled = false;
                    }
                });
            });
            _this._twoJumpBtn.addEventListener('click', function () {
                _this._twoJumpBtn.disabled = true;
                _this.twiceMoveField();
                window.console.log(_this._stepList);
                createjs_module_1.Tween.get(_this._playerContainer)
                    .to({ x: _this._playerContainer.x - 10 }, 100)
                    .to({ y: _this._playerContainer.y - _this.STEP_FIELD_HIGH * 5 }, 200, createjs_module_1.Ease.cubicInOut)
                    .to({ x: _this._playerContainer.x, y: _this.FIELD_POS.y + -_this.STEP_FIELD_HIGH }, 350, createjs_module_1.Ease.cubicIn)
                    .call(function () {
                    createjs_module_1.Tween.removeTweens(_this._playerContainer);
                    if (!_this._stepList[1].isTrap) {
                        if (_this._stepList[1].enemy) {
                            _this._stepList[1].step.removeChild(_this._stepList[1].enemy);
                            setTimeout(function () {
                                _this._oneJumpBtn.disabled = false;
                                _this._twoJumpBtn.disabled = false;
                            }, 2000);
                        }
                        else {
                            throw Error('トラップがないような');
                        }
                    }
                    else {
                        _this._oneJumpBtn.disabled = false;
                        _this._twoJumpBtn.disabled = false;
                    }
                });
            });
        };
        // 跳躍後の足場生成
        _this.reCreateStep = function (i) {
            if (i === _this._stepList.length - 1) {
                var fadeOutStep = _this._stepList[0];
                _this._stepList.shift();
                _this.setStepField();
                _this.gameStage.removeChild(fadeOutStep.step);
            }
        };
        //    一段とび
        _this.moveField = function () {
            _this._stepList.forEach(function (v, i) {
                createjs_module_1.Tween.get(v.step)
                    .to({ x: v.step.x - _this.FIELD_POS.x }, 600)
                    .call(function () {
                    _this.reCreateStep(i);
                });
            });
        };
        //    二段とび
        _this.twiceMoveField = function () {
            _this._stepList.forEach(function (v, i) {
                createjs_module_1.Tween.get(v.step)
                    .to({ x: v.step.x - _this.FIELD_POS.x * 2 }, 600)
                    .call(function () {
                    _this.reCreateStep(i);
                    _this.reCreateStep(i);
                    if (i == _this._stepList.length - 1) {
                        _this._stepList[_this._stepList.length - 2].step.x -= _this.FIELD_POS.x;
                    }
                });
            });
        };
        _this._canvas = canvas;
        _this.gameStage = new createjs_module_1.Stage(_this._canvas);
        _this._bgColor = bgColor;
        return _this;
    }
    GamePage.prototype.run = function () {
        window.console.log('dfsfsdfs');
        this.playerJumpEvent();
    };
    return GamePage;
}(createjs_module_1.Container));
exports.GamePage = GamePage;
