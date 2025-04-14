//@ts-ignore
import {Stage, Shape, Ticker, Tween, Ease, Container} from 'createjs-module';
import {stepColorChoiceRand} from './RandMarker';
import * as trace_events from 'node:trace_events';
import {coloType} from './Main';

namespace stepColor {
  export type brown='#965042';
  export type green='#3eb37000';
}
 const brown = '#965042';
 const green = '#3eb37000';
type StepColorType = stepColor.brown | stepColor.green;
type StepType = { step: Container, isAshiba: boolean }
export class GamePage extends Container {
    private readonly STEP_FIELD_WIDTH = 70;
    private readonly STEP_FIELD_HIGH = 20;
    private readonly PLAYER_SIZE = 20;
    private readonly FIELD_POS = {x: 90, y: 370};
    private MAX_STEP_LEN = 9;
//  背景
    private _bg: Shape = new Shape();
    private _bgColor:string;
    private _canvas: HTMLCanvasElement;
    private gameStage: Stage;
    private _stepList: Array<StepType> = [];
    private _player = new Shape();
    private _playerContainer = new Container();
    private _oneJumpBtn = document.getElementById('oneStepBtn') as HTMLButtonElement;
    private _twoJumpBtn = document.getElementById('twoStepBtn') as HTMLButtonElement;
//    ステップが穴あきならtrue;
    private _isBlankStep = false;
    private STEP_COLOR: StepColorType = '#965042';
    private _isInit = true;

    public constructor(canvas: HTMLCanvasElement,bgColor:string ) {
        super();
        this._canvas = canvas;
        this.gameStage = new Stage(this._canvas);
        this._bgColor =bgColor;
    }

    public init = () => {
        this._stepList = [];
        this._bg.graphics.beginFill(this._bgColor).drawRect(0, 0, 640, 480);
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

    public run() {
        window.console.log('game開始');
        this.playerJumpEvent();
    }

    public startTicker = () => {
        Ticker.framerate = 60;
        Ticker.addEventListener('tick', this._tick);
    };
    private _tick = () => {
        this.gameStage.update();
    };

// stepFieldを作成
    private createStepField = (index: number) => {
        const stepContainer = new Container();
        const stepField = new Shape();
        const createBlankStep = (): StepColorType => {
// ランダム値が0なら空白stepを作成
            if (!stepColorChoiceRand()) {
// boolがすでにtrue(直前が空白)ならstep有を返す
                if (this._isBlankStep) {
                    this._isBlankStep = false;
                    return brown;
                } else {
// 初期位置を穴あきにさせない
                    if (this._isInit && index === 1) {
                        this._isBlankStep = false;
                        return brown;
                    } else {
                        this._isBlankStep = true;
                        return green;
                    }
                }
            } else {
                this._isBlankStep = false;
                return brown;
            }
        };
        this.STEP_COLOR = createBlankStep();
        stepField.graphics.beginFill(this.STEP_COLOR).drawRect(0, 0, this.STEP_FIELD_WIDTH, this.STEP_FIELD_HIGH);
        stepContainer.addChild(stepField);
        this.gameStage.addChild(stepContainer);
        if (this.STEP_COLOR === brown) {
            this._stepList.push({step: stepContainer, isAshiba: true});
        } else if (this.STEP_COLOR === green) {
            if (this._isInit && index === 1) {
                this._stepList.push({step: stepContainer, isAshiba: true});
            } else {
                this._stepList.push({step: stepContainer, isAshiba: false});
            }
        }
        this._stepList[index].step.y = this.FIELD_POS.y;
        this._stepList[index].step.x = this.FIELD_POS.x * index + 10;
    };
    private setStepField = () => {
        while (this._stepList.length < this.MAX_STEP_LEN) {
            const index = this._stepList.length;
            this.createStepField(index);
        }
    };
    /**
     * プレイヤージャンプ
     * 一段とび/二段とび
     */

    private playerJumpEvent = () => {
        this._oneJumpBtn.addEventListener('click', () => {
            this._oneJumpBtn.disabled = true;
            this.moveField();
            window.console.log(this._stepList);
            Tween.get(this._playerContainer)
                .to({x: this._playerContainer.x - 10}, 100)
                .to({y: this._playerContainer.y - this.STEP_FIELD_HIGH * 5}, 200, Ease.cubicInOut)
                .to({x: this._playerContainer.x, y: this.FIELD_POS.y + -this.STEP_FIELD_HIGH}, 350, Ease.cubicIn)
                .call(() => {
                    Tween.removeTweens(this._playerContainer);
                    if (!this._stepList[1].isAshiba) {
                        Tween.get(this._playerContainer)
                            .to({y: 600}, 400);
                    } else {
                        this._oneJumpBtn.disabled = false;
                    }
                });
        });
        this._twoJumpBtn.addEventListener('click', () => {
            this._twoJumpBtn.disabled = true;
            this.twiceMoveField();
            window.console.log(this._stepList);
            Tween.get(this._playerContainer)
                .to({x: this._playerContainer.x - 10}, 100)
                .to({y: this._playerContainer.y - this.STEP_FIELD_HIGH * 5}, 200, Ease.cubicInOut)
                .to({x: this._playerContainer.x, y: this.FIELD_POS.y + -this.STEP_FIELD_HIGH}, 350, Ease.cubicIn)
                .call(() => {
                    Tween.removeTweens(this._playerContainer);
                    if (!this._stepList[1].isAshiba) {
                        Tween.get(this._playerContainer)
                            .to({y: 600}, 400);
                    } else {
                        this._twoJumpBtn.disabled = false;
                    }
                });
        });
    };
// 跳躍後の足場生成
    private reCreateStep = (i: number) => {
        if (i === this._stepList.length - 1) {
            const fadeOutStep = this._stepList[0];
            this._stepList.shift();
            this.setStepField();
            this.gameStage.removeChild(fadeOutStep.step);
        }
    };
//    一段とび
    private moveField = () => {
        this._stepList.forEach((v, i) => {
            Tween.get(v.step)
                .to({x: v.step.x - this.FIELD_POS.x}, 600)
                .call(() => {
                    this.reCreateStep(i);
                });
        });
    };
//    二段とび
    private twiceMoveField = () => {
        this._stepList.forEach((v, i) => {
            Tween.get(v.step)
                .to({x: v.step.x - this.FIELD_POS.x * 2}, 600)
                .call(() => {
                    this.reCreateStep(i);
                    this.reCreateStep(i);
                    if (i == this._stepList.length - 1) {
                        this._stepList[this._stepList.length - 2].step.x -= this.FIELD_POS.x;
                    }
                });
        });
    };
}
