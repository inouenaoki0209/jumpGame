//@ts-ignore
import {Stage, Shape, Ticker, Tween, Ease, Container} from 'createjs-module';
import {stepColorChoiceRand} from './RandMarker';

type StepColorType = 'brown' | 'green'

export class GamePage extends Container {
    private readonly STEP_FIELD_WIDTH = 70;
    private readonly STEP_FIELD_HIGH = 20;
    private readonly PLAYER_SIZE = 20;
    private readonly FIELD_POS = {x: 90, y: 370};
    private MAX_STEP_LEN = 7;
//  背景
    private _bg: Shape = new Shape();
    private _canvas: HTMLCanvasElement;
    private gameStage: Stage;
    private _stepList: Array<createjs.Container> = [];
    private _player = new Shape();
    private _playerContainer = new Container();
    private _oneJumpBtn = document.getElementById('oneStepBtn') as HTMLButtonElement;
    private _twoJumpBtn = document.getElementById('twoStepBtn') as HTMLButtonElement;
//    ステップが穴あきならtrue;
    private _isBlankStep = false;
    private STEP_COLOR: StepColorType = 'brown';

    public constructor(canvas: HTMLCanvasElement) {
        super();
        this._canvas = canvas;
        this.gameStage = new Stage(this._canvas);
    }

    public init = () => {
        this._stepList = [];
        this._bg.graphics.beginFill('green').drawRect(0, 0, 640, 480);
        this._player.graphics.beginFill('yellow').drawCircle(0, 0, this.PLAYER_SIZE);
        this._playerContainer.addChild(this._player);
        this.gameStage.addChild(this._bg);
        this.setStepField();
        this.gameStage.addChild(this._playerContainer);
        this._playerContainer.set({
            x: this.FIELD_POS.x + this.STEP_FIELD_WIDTH / 2 + 10,
            y: this.FIELD_POS.y + -this.STEP_FIELD_HIGH
        });
        window.console.log(this.gameStage);
        console.log('children:', this.gameStage.children);
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
//                boolがすでにtrue(直前が空白)ならstep有を返す
                if (this._isBlankStep) {
                    this._isBlankStep = false;
                    return 'brown';
                }else{
                    this._isBlankStep = true;
                    return 'green';
                }
            } else {
                this._isBlankStep = false;
                return 'brown';
            }
        };
        this.STEP_COLOR = createBlankStep();
        stepField.graphics.beginFill(this.STEP_COLOR).drawRect(0, 0, this.STEP_FIELD_WIDTH, this.STEP_FIELD_HIGH);
        stepContainer.addChild(stepField);
        this.gameStage.addChild(stepContainer);
        this._stepList.push(stepContainer);
        this._stepList[index].y = this.FIELD_POS.y;
        this._stepList[index].x = this.FIELD_POS.x * index + 10;
    };
    private setStepField = () => {
        while (this._stepList.length < this.MAX_STEP_LEN) {
            const index = this._stepList.length;
            this.createStepField(index);
        }
    };
    private playerJumpEvent = () => {
        this._oneJumpBtn.addEventListener('click', () => {
            this._oneJumpBtn.disabled = true;
            this.moveField();
            Tween.get(this._playerContainer)
                .to({x: this._playerContainer.x - 10}, 100)
                .to({y: this._playerContainer.y - this.STEP_FIELD_HIGH * 5}, 200, Ease.cubicInOut)
                .to({x: this._playerContainer.x, y: this.FIELD_POS.y + -this.STEP_FIELD_HIGH}, 300, Ease.cubicIn)
                .call(() => this._oneJumpBtn.disabled = false);
        });
    };
    private moveField = () => {
        this._stepList.forEach((v, i) => {
            Tween.get(v)
                .to({x: v.x - this.FIELD_POS.x}, 600)
                .call(() => {
                    if (i === this._stepList.length - 1) {
                        const fadeOutStep = this._stepList[0];
                        this._stepList.shift();
                        this.setStepField();
                        this.gameStage.removeChild(fadeOutStep);
                    }
                });
        });
    };
}
