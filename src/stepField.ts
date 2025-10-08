import {Container, Shape, Stage} from 'createjs-module';
import {secondRand, stepColorChoiceRand} from './RandMarker';
import {
    FIELD_POS,
    MAX_STEP_LEN,
    STEP_FIELD_HIGH,
    STEP_FIELD_WIDTH,
    StepColorType, StepState,
    StepType
} from './GamePage';

export class StepField {
    private _stage: Stage;
    private _stepList: Array<StepType>;
    private _isInit: boolean;
    private STEP_COLOR: StepColorType = '#965042';

    public constructor(stage: Stage, stepList: Array<StepType>, isInit: boolean) {
        this._stage = stage;
        this._stepList = stepList;
        this._isInit = isInit;
    }

    private createEnemy = () => {
        const enemy = new Shape();
        enemy.set({x: 35, y: -16});
        enemy.graphics.beginFill('blue').drawCircle(0, 0, 15);
        return enemy;
    };

    private createItem = () => {
        const item = new Shape();
        item.set({x: 35, y: -16});
        item.graphics.beginFill('purple').drawCircle(0, 0, 15);
        return item;
    };
    /**
     * stepFieldを作成
     * @param {number} index stepList内の位置
     */
    private createStepField = (index: number) => {
        const stepContainer = new Container();
        const stepField = new Shape();
        const fieldChoice = (): StepState => {
            const rand = stepColorChoiceRand();
            if (rand === 0) {
                return createItem();
            } else {
                return 'none';
            }
        };
        // 障害物作成
        const createItem = (): StepState => {
            // ランダム値設定
            const rand = stepColorChoiceRand();
            const getLatestStepList = () => this._stepList;
            // ランダム値が1かつリスト内にアイテムがいないならアイテム生成
            // お助けアイテム生成
            const itemSearch = getLatestStepList().find((step) => step.state === 'item');
            const enemySearch = getLatestStepList().find((step) => step.state !== 'enemy');
            if (rand === 2) {
                // 初回のプレイヤー位置にはアイテムを返さない
                if (this._isInit && index === 1) {
                    return 'none';
                } else {
                    if (!itemSearch) {
                        return 'item';
                    } else {
                        return 'none';
                    }
                }
            } else if (0||1) {
                // ランダム値が0の時
                // 直前が障害物でないなら障害物生成
                if (this._isInit && index === 1) {
                    return 'none';
                } else if (getLatestStepList().length > 1 && getLatestStepList()[index - 1].state !== 'enemy') {
                    return 'enemy';
                } else {
                    return 'none';
                }
            } else if (enemySearch === undefined) {
                //  配列内に障害物がないなら障害物生成
                return 'enemy';
            } else {
                return 'none';
            }
        };

        stepField.graphics.beginFill(this.STEP_COLOR).drawRect(0, 0, STEP_FIELD_WIDTH, STEP_FIELD_HIGH);
        stepContainer.addChild(stepField);
        this._stage.addChild(stepContainer);

        const decidedItem = fieldChoice();
        if (decidedItem === 'none') {
            this._stepList.push({step: stepContainer, state: 'none'});
        } else if (decidedItem === 'enemy') {
            const enemy = this.createEnemy();
            stepContainer.addChild(enemy);
            this._stepList.push({step: stepContainer, state: 'enemy',addItem:enemy});
        } else if (decidedItem === 'item') {
            const item = this.createItem();
            stepContainer.addChild(item);
            this._stepList.push({step: stepContainer, state: 'item',addItem:item});
        } else {
            this._stepList.push({step: stepContainer, state: 'none'});
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