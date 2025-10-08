"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameTimer = void 0;
const EventEmitter_1 = require("./module/EventEmitter");
class GameTimer {
    timeLeft;
    intervalId = null;
    constructor(initialSeconds) {
        this.timeLeft = initialSeconds;
    }
    start() {
        if (this.intervalId !== null)
            return; // 二重起動防止
        this.intervalId = window.setInterval(() => {
            this.timeLeft--;
            EventEmitter_1.EventEmitter.getInstance().emit('Tick');
            if (this.timeLeft <= 0) {
                this.stop();
                EventEmitter_1.EventEmitter.getInstance().emit('GameOver');
            }
        }, 1000);
    }
    stop() {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
    addTime(seconds) {
        this.timeLeft += seconds;
    }
    reset(seconds) {
        this.stop();
        this.timeLeft = seconds;
    }
    getTimeLeft() {
        return this.timeLeft;
    }
}
exports.GameTimer = GameTimer;
