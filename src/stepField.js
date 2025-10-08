"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StepField = void 0;
const createjs_module_1 = require("createjs-module");
const RandMarker_1 = require("./RandMarker");
const GamePage_1 = require("./GamePage");
class StepField {
    _stage;
    _stepList;
    _isInit;
    STEP_COLOR = '#965042';
    constructor(stage, stepList, isInit) {
        this._stage = stage;
        this._stepList = stepList;
        this._isInit = isInit;
    }
    createEnemy = () => {
        const enemy = new createjs_module_1.Shape();
        enemy.set({ x: 35, y: -16 });
        enemy.graphics.beginFill('blue').drawCircle(0, 0, 15);
        return enemy;
    };
    createItem = () => {
        const item = new createjs_module_1.Shape();
        item.set({ x: 35, y: -16 });
        item.graphics.beginFill('purple').drawCircle(0, 0, 15);
        return item;
    };
    /**
     * stepFieldを作成
     * @param {number} index stepList内の位置
     */
    createStepField = (index) => {
        const stepContainer = new createjs_module_1.Container();
        const stepField = new createjs_module_1.Shape();
        const fieldChoice = () => {
            const rand = (0, RandMarker_1.stepColorChoiceRand)();
            if (rand === 0) {
                return createItem();
            }
            else {
                return 'none';
            }
        };
        // 障害物作成
        const createItem = () => {
            // ランダム値設定
            const rand = (0, RandMarker_1.stepColorChoiceRand)();
            const getLatestStepList = () => this._stepList;
            // ランダム値が1かつリスト内にアイテムがいないならアイテム生成
            // お助けアイテム生成
            const itemSearch = getLatestStepList().find((step) => step.state === 'item');
            const enemySearch = getLatestStepList().find((step) => step.state !== 'enemy');
            if (rand === 2) {
                // 初回のプレイヤー位置にはアイテムを返さない
                if (this._isInit && index === 1) {
                    return 'none';
                }
                else {
                    if (!itemSearch) {
                        return 'item';
                    }
                    else {
                        return 'none';
                    }
                }
            }
            else if (0 || 1) {
                // ランダム値が0の時
                // 直前が障害物でないなら障害物生成
                if (this._isInit && index === 1) {
                    return 'none';
                }
                else if (getLatestStepList().length > 1 && getLatestStepList()[index - 1].state !== 'enemy') {
                    return 'enemy';
                }
                else {
                    return 'none';
                }
            }
            else if (enemySearch === undefined) {
                //  配列内に障害物がないなら障害物生成
                return 'enemy';
            }
            else {
                return 'none';
            }
        };
        stepField.graphics.beginFill(this.STEP_COLOR).drawRect(0, 0, GamePage_1.STEP_FIELD_WIDTH, GamePage_1.STEP_FIELD_HIGH);
        stepContainer.addChild(stepField);
        this._stage.addChild(stepContainer);
        const decidedItem = fieldChoice();
        if (decidedItem === 'none') {
            this._stepList.push({ step: stepContainer, state: 'none' });
        }
        else if (decidedItem === 'enemy') {
            const enemy = this.createEnemy();
            stepContainer.addChild(enemy);
            this._stepList.push({ step: stepContainer, state: 'enemy', addItem: enemy });
        }
        else if (decidedItem === 'item') {
            const item = this.createItem();
            stepContainer.addChild(item);
            this._stepList.push({ step: stepContainer, state: 'item', addItem: item });
        }
        else {
            this._stepList.push({ step: stepContainer, state: 'none' });
        }
        this._stepList[index].step.y = GamePage_1.FIELD_POS.y;
        this._stepList[index].step.x = GamePage_1.FIELD_POS.x * index + 10;
    };
    setStepField = () => {
        while (this._stepList.length < GamePage_1.MAX_STEP_LEN) {
            const index = this._stepList.length;
            this.createStepField(index);
        }
    };
}
exports.StepField = StepField;
