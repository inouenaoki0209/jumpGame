"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stepColorChoiceRand = void 0;
const stepColorChoiceRand = () => {
    const randValue = 3;
    return randBase(randValue);
};
exports.stepColorChoiceRand = stepColorChoiceRand;
const randBase = (baseNum) => {
    return Math.floor(Math.random() * baseNum);
};
