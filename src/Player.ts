import {Container, Ease, Shape, Stage, Tween} from 'createjs-module';
import {FIELD_POS, PLAYER_SIZE, STEP_FIELD_HIGH, STEP_FIELD_WIDTH, StepType} from './GamePage';
import {StepField} from './stepField';
import {GameTimer} from './GameTimer';


export class Player {
    private _player = new Shape();
    private _playerContainer = new Container();
    private _stage: Stage;
    private _stepList: Array<StepType>;
    private _stepField: StepField;
    private _oneJumpBtn = document.getElementById('oneStepBtn') as HTMLButtonElement;
    private _twoJumpBtn = document.getElementById('twoStepBtn') as HTMLButtonElement;
    private _timer: GameTimer;
    private _totalDistance = 0;
    private _totalDistanceText = document.getElementById('totalDistance') as HTMLElement;

    public constructor(stage: Stage, stepList: Array<StepType>, stepField: StepField, timer: GameTimer) {
        this._stage = stage;
        this._stepList = stepList;
        this._stepField = stepField;
        this._timer = timer;
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

    public end = () => {
        this.disAbleBtnClick();
        this._oneJumpBtn.removeEventListener('click', this.oneJumpClick);
        this._twoJumpBtn.removeEventListener('click', this.twoJumpClick);
    };
    public run = () => {
        this.playerJumpEvent();
    };

    private disAbleBtnClick = () => {
        this._oneJumpBtn.disabled = true;
        this._twoJumpBtn.disabled = true;
    };
    private permitBtnClick = () => {
        this._oneJumpBtn.disabled = false;
        this._twoJumpBtn.disabled = false;
    };
    private jumpAfter = () => {
        Tween.removeTweens(this._playerContainer);
        if (this._stepList[1].state === 'enemy') {
            if (this._stepList[1].addItem) {
                this._stepList[1].step.removeChild(this._stepList[1].addItem);
                setTimeout(() => {
                    this.permitBtnClick();
                }, 2000);
            } else {
                throw Error('トラップがないような');
            }
        } else if (this._stepList[1].state === 'item') {
//            お助けアイテム獲得
            if (this._stepList[1].addItem) {
                this._stepList[1].step.removeChild(this._stepList[1].addItem);
            }
//            3秒追加
            this._timer.addTime(3);
            this.permitBtnClick();
        } else {
            this.permitBtnClick();
        }
    };
    private oneJumpClick = () => {
        this.disAbleBtnClick();
        this.moveField();
        Tween.get(this._playerContainer)
            .to({x: this._playerContainer.x - 10}, 100)
            .to({y: this._playerContainer.y - STEP_FIELD_HIGH * 5}, 200, Ease.cubicInOut)
            .to({x: this._playerContainer.x, y: FIELD_POS.y + -STEP_FIELD_HIGH}, 350, Ease.cubicIn)
            .call(() => {
                this.jumpAfter();
                this._totalDistance += 1;
                if (this._totalDistanceText.textContent) {
                    this._totalDistanceText.textContent = `現在 : ${this._totalDistance} M`;
                }
            });
    };
    private twoJumpClick = () => {
        this.disAbleBtnClick();
        this.twiceMoveField();
        Tween.get(this._playerContainer)
            .to({x: this._playerContainer.x - 10}, 100)
            .to({y: this._playerContainer.y - STEP_FIELD_HIGH * 5}, 200, Ease.cubicInOut)
            .to({x: this._playerContainer.x, y: FIELD_POS.y + -STEP_FIELD_HIGH}, 350, Ease.cubicIn)
            .call(() => {
                this.jumpAfter();
                this._totalDistance += 2;
                if (this._totalDistanceText.textContent) {
                    this._totalDistanceText.textContent = `現在 : ${this._totalDistance} M`;
                }
            });
    };
    private playerJumpEvent = () => {
        this._oneJumpBtn.addEventListener('click', this.oneJumpClick);
        this._twoJumpBtn.addEventListener('click', this.twoJumpClick);
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