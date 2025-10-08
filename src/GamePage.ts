//@ts-ignore
import {Stage, Shape, Ticker, Tween, Ease, Container} from 'createjs-module';
import {stepColorChoiceRand} from './RandMarker';
import * as trace_events from 'node:trace_events';
import {coloType, showResultScreen} from './Main';
import {Player} from './Player';
import {StepField} from './stepField';
import {GameTimer} from './GameTimer';
import {EventEmitter} from './module/EventEmitter';

namespace stepColor {
    export type brown = '#965042';
}
export type StepState = 'none' | 'enemy' | 'item'


export const brown = '#965042';
export type StepColorType = stepColor.brown
export type StepType = { step: Container, state: StepState, addItem?: Shape }
export const STEP_FIELD_WIDTH = 70;
export const STEP_FIELD_HIGH = 20;
export const FIELD_POS = {x: 90, y: 370};
export const PLAYER_SIZE = 20;
export const MAX_STEP_LEN = 10;

export class GamePage extends Container {
//  背景
    private _bg: Shape = new Shape();
    private _bgColor: string;
    private _canvas: HTMLCanvasElement;
    private gameStage: Stage;
    private _stepField: StepField;
    private _stepList: Array<StepType> = [];
    private _timer: GameTimer;
    private playerManager: Player;
    private _isInit = true;
    private timerUI = document.getElementById('timer') as HTMLElement;

    public constructor(canvas: HTMLCanvasElement, bgColor: string) {
        super();
        this._canvas = canvas;
        this.gameStage = new Stage(this._canvas);
        this._bgColor = bgColor;
        this._stepField = new StepField(this.gameStage, this._stepList, this._isInit);
        this._timer = new GameTimer(60);
        this.playerManager = new Player(this.gameStage, this._stepList, this._stepField, this._timer);
        EventEmitter.getInstance().addEventLister('GameOver', this.gameEnd);
    }

    public init = () => {
        this._stepList = [];
        this._bg.graphics.beginFill(this._bgColor).drawRect(0, 0, 640, 480);

        this.gameStage.addChild(this._bg);
        this._stepField.setStepField();
        this._isInit = false;
        this.playerManager.init();
        this.gameStage.update();
    };

    public run() {
        this.playerManager.run();
        EventEmitter.getInstance().addEventLister('Tick', () => {
            window.console.log('今', this._timer.getTimeLeft());
            if (this.timerUI.textContent) {
                this.timerUI.textContent = `残り ${this._timer.getTimeLeft()}秒です`;
            }

        });
        this._timer.start();
    }

    private _timeOutAsync = async (time: number) => {
        const timer = () =>
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(resolve);
                }, time);
            });
        return timer();
    };
    private gameEnd = async () => {
        window.console.log('時間切れ');
        this.playerManager.removeClickEvent();
        await this._timeOutAsync(1000);
        this.playerManager.destroy();
        showResultScreen(this.playerManager._totalDistance);
    };
    public startTicker = () => {
        Ticker.framerate = 60;
        Ticker.addEventListener('tick', this._tick);
    };
    private _tick = () => {
        this.gameStage.update();
    };
}
