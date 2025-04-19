//@ts-ignore
import {Stage, Shape, Ticker, Tween, Ease, Container} from 'createjs-module';
import {stepColorChoiceRand} from './RandMarker';
import * as trace_events from 'node:trace_events';
import {coloType} from './Main';
import {Player} from './Player';
import {StepField} from './stepField';

namespace stepColor {
    export type brown = '#965042';
    export type red = '#FF0000';
}
export const brown = '#965042';
export const red = '#FF0000';
export type StepColorType = stepColor.brown | stepColor.red;
export type StepType = { step: Container, isTrap: boolean, enemy?: Shape }
export const STEP_FIELD_WIDTH = 70;
export const STEP_FIELD_HIGH = 20;
export const FIELD_POS = {x: 90, y: 370};
export const PLAYER_SIZE = 20;
export const MAX_STEP_LEN = 10;

export class GamePage extends Container {
    private readonly STEP_FIELD_WIDTH = 70;
    private readonly STEP_FIELD_HIGH = 20;
    private readonly FIELD_POS = {x: 90, y: 370};
//  背景
    private _bg: Shape = new Shape();
    private _bgColor: string;
    private _canvas: HTMLCanvasElement;
    private gameStage: Stage;
    private _stepField: StepField;
    private _stepList: Array<StepType> = [];

    private playerManager: Player;


    private _isInit = true;

    public constructor(canvas: HTMLCanvasElement, bgColor: string) {
        super();
        this._canvas = canvas;
        this.gameStage = new Stage(this._canvas);
        this._bgColor = bgColor;
        this._stepField = new StepField(this.gameStage, this._stepList, this._isInit);
        this.playerManager = new Player(this.gameStage, this._stepList, this._stepField);
        window.console.log('リファクタリングしたよ')
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
        window.console.log('kanntgfdgdou');
        this.playerManager.run();
    }

    public startTicker = () => {
        Ticker.framerate = 60;
        Ticker.addEventListener('tick', this._tick);
    };
    private _tick = () => {
        this.gameStage.update();
    };
}
