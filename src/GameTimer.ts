import {EventEmitter} from './module/EventEmitter';
import {showResultScreen} from './Main';

export class GameTimer {
    private timeLeft: number;
    private intervalId: number | null = null;

    public constructor(
        initialSeconds: number,
    ) {
        this.timeLeft = initialSeconds;
    }

    public start() {
        if (this.intervalId !== null) return; // 二重起動防止
        this.intervalId = window.setInterval(() => {
            this.timeLeft--;
            EventEmitter.getInstance().emit('Tick');
            if (this.timeLeft <= 0) {
                this.stop();
                EventEmitter.getInstance().emit('GameOver');
            }
        }, 1000);
    }

    public stop() {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    public addTime(seconds: number) {
        this.timeLeft += seconds;
    }

    public reset(seconds: number) {
        this.stop();
        this.timeLeft = seconds;
    }

    public getTimeLeft() {
        return this.timeLeft;
    }
}
