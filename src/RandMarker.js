"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stepColorChoiceRand = void 0;
var stepColorChoiceRand = function () {
    var randValue = 3;
    return randBase(randValue);
};
exports.stepColorChoiceRand = stepColorChoiceRand;
var randBase = function (baseNum) {
    return Math.floor(Math.random() * baseNum);
};
