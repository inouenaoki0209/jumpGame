import {Container, Shape, Stage} from 'createjs-module';
import {stepColorChoiceRand} from './RandMarker';
import {
    brown,
    FIELD_POS,
    MAX_STEP_LEN,
    red,
    STEP_FIELD_HIGH,
    STEP_FIELD_WIDTH,
    StepColorType,
    StepType
} from './GamePage';

export class StepField {
    private _stage: Stage;
    private _stepList: Array<StepType>;
//    ステップが穴あきならtrue;
    private _isBlankStep = false;
    private _isInit: boolean;
    private STEP_COLOR: StepColorType = '#965042';

    public constructor(stage: Stage, stepList: Array<StepType>,isInit: boolean) {
        this._stage = stage;
        this._stepList = stepList;
        this._isInit = isInit
    }

    // stepFieldを作成
    private createStepField = (index: number) => {
        const stepContainer = new Container();
        const stepField = new Shape();
        const enemy = new Shape();
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
                        return red;
                    }
                }
            } else {
                this._isBlankStep = false;
                return brown;
            }
        };
        this.STEP_COLOR = createBlankStep();
        stepField.graphics.beginFill(this.STEP_COLOR).drawRect(0, 0, STEP_FIELD_WIDTH, STEP_FIELD_HIGH);
        enemy.graphics.beginFill('blue').drawCircle(0, 0, 15);
        stepContainer.addChild(stepField);
        this._stage.addChild(stepContainer);
        if (this.STEP_COLOR === brown) {
            this._stepList.push({step: stepContainer, isTrap: true});
        } else if (this.STEP_COLOR === red) {
            if (this._isInit && index === 1) {
                this._stepList.push({step: stepContainer, isTrap: true});
            } else {
                stepContainer.addChild(enemy);
                enemy.set({x: 35, y: -16});
                this._stepList.push({step: stepContainer, isTrap: false, enemy: enemy});
            }
        }
        this._stepList[index].step.y = FIELD_POS.y;
        this._stepList[index].step.x = FIELD_POS.x * index + 10;
    };
    public setStepField = () => {
        while (this._stepList.length < MAX_STEP_LEN) {
            const index = this._stepList.length;
            this.createStepField(index);
        }
    };
}