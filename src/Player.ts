import {Container, Ease, Shape, Stage, Tween} from 'createjs-module';
import {FIELD_POS, PLAYER_SIZE, STEP_FIELD_HIGH, STEP_FIELD_WIDTH, StepType} from './GamePage';
import {StepField} from './stepField';


export class Player {
    private _player = new Shape();
    private _playerContainer = new Container();
    private _stage: Stage;
    private _stepList: Array<StepType>;
    private _stepField: StepField
    private _oneJumpBtn = document.getElementById('oneStepBtn') as HTMLButtonElement;
    private _twoJumpBtn = document.getElementById('twoStepBtn') as HTMLButtonElement;
    public constructor(stage: Stage,stepList: Array<StepType>,stepField: StepField) {
        this._stage = stage;
        this._stepList = stepList;
        this._stepField = stepField
    }

    public init() {
        this._player.graphics.beginFill('yellow').drawCircle(0, 0, PLAYER_SIZE);
        this._playerContainer.addChild(this._player);
        this._stage.addChild(this._playerContainer);
        this._playerContainer.set({
            x: FIELD_POS.x + STEP_FIELD_WIDTH / 2 + 10,
            y: FIELD_POS.y + -STEP_FIELD_HIGH
        });
    }
    public run = ()=>{
        this.playerJumpEvent()
    }
    private playerJumpEvent = () => {
        this._oneJumpBtn.addEventListener('click', () => {
            this._oneJumpBtn.disabled = true;
            this.moveField();
            window.console.log(this._stepList);
            Tween.get(this._playerContainer)
                .to({x: this._playerContainer.x - 10}, 100)
                .to({y: this._playerContainer.y - STEP_FIELD_HIGH * 5}, 200, Ease.cubicInOut)
                .to({x: this._playerContainer.x, y: FIELD_POS.y + -STEP_FIELD_HIGH}, 350, Ease.cubicIn)
                .call(() => {
                    Tween.removeTweens(this._playerContainer);
                    if (!this._stepList[1].isTrap) {
                        if (this._stepList[1].enemy) {
                            this._stepList[1].step.removeChild(this._stepList[1].enemy);
                            setTimeout(() => {
                                this._oneJumpBtn.disabled = false;
                                this._twoJumpBtn.disabled = false;
                            }, 2000);
                        } else {
                            throw Error('トラップがないような');
                        }
                    } else {
                        this._oneJumpBtn.disabled = false;
                        this._twoJumpBtn.disabled = false;
                    }
                });
        });
        this._twoJumpBtn.addEventListener('click', () => {
            this._twoJumpBtn.disabled = true;
            this.twiceMoveField();
            window.console.log(this._stepList);
            Tween.get(this._playerContainer)
                .to({x: this._playerContainer.x - 10}, 100)
                .to({y: this._playerContainer.y - STEP_FIELD_HIGH * 5}, 200, Ease.cubicInOut)
                .to({x: this._playerContainer.x, y: FIELD_POS.y + -STEP_FIELD_HIGH}, 350, Ease.cubicIn)
                .call(() => {
                    Tween.removeTweens(this._playerContainer);
                    if (!this._stepList[1].isTrap) {
                        if (this._stepList[1].enemy) {
                            this._stepList[1].step.removeChild(this._stepList[1].enemy);
                            setTimeout(() => {
                                this._oneJumpBtn.disabled = false;
                                this._twoJumpBtn.disabled = false;
                            }, 2000);
                        } else {
                            throw Error('トラップがないような');
                        }
                    } else {
                        this._oneJumpBtn.disabled = false;
                        this._twoJumpBtn.disabled = false;
                    }
                });
        });
    };
    /**
     * プレイヤージャンプ
     * 一段とび/二段とび
     */

        //    一段とび
    private moveField = () => {
        this._stepList.forEach((v, i) => {
            Tween.get(v.step)
                .to({x: v.step.x - FIELD_POS.x}, 600)
                .call(() => {
                    this.reCreateStep(i);
                });
        });
    };
//    二段とび
    private twiceMoveField = () => {
        this._stepList.forEach((v, i) => {
            Tween.get(v.step)
                .to({x: v.step.x - FIELD_POS.x * 2}, 600)
                .call(() => {
                    this.reCreateStep(i);
                    this.reCreateStep(i);
                    if (i == this._stepList.length - 1) {
                        this._stepList[this._stepList.length - 2].step.x -= FIELD_POS.x;
                    }
                });
        });
    };
    // 跳躍後の足場生成
    private reCreateStep = (i: number) => {
        if (i === this._stepList.length - 1) {
            const fadeOutStep = this._stepList[0];
            this._stepList.shift();
            this._stepField.setStepField();
            this._stage.removeChild(fadeOutStep.step);
        }
    };
}