"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.secondRand = exports.stepColorChoiceRand = void 0;
// 足場抽選
const stepColorChoiceRand = () => {
    const randValue = 3;
    return randBase(randValue);
};
exports.stepColorChoiceRand = stepColorChoiceRand;
// 足場の2次抽選
const secondRand = () => {
    const randValue = 2;
    return randBase(randValue);
};
exports.secondRand = secondRand;
const randBase = (baseNum) => {
    return Math.floor(Math.random() * baseNum);
};
