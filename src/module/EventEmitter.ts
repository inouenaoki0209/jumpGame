import * as events from 'node:events';
import {EventName} from '../types/EventType';

export type EventType<T> = { name: EventName, callBack: (eventObj: T | undefined) => void };
export type EventFunction<T> = (eventObj: T) => void;

export class EventEmitter {

    private eventList: Array<EventType<any>> = [];
    private static _instance: EventEmitter;

    private constructor() {
    }

    public static getInstance() {
        if (!EventEmitter._instance) {
            EventEmitter._instance = new EventEmitter();
        }
        return EventEmitter._instance;
    }

    public addEventLister<T>(eventName: EventName, callback: EventFunction<T>): void {
        this.eventList.push({name: eventName, callBack: callback});
    }

    public removeEventLister<T>(eventName: EventName, callback: EventFunction<T>): void {
        const findName = this.eventList.filter(event => event.name !== eventName);
        this.eventList = findName.filter(event => event.callBack !== callback);
    }

    public removeAllEventListers<T>(eventName?: EventName): void {
        if (eventName) {
            this.eventList = this.eventList.filter((events) => events.name !== eventName);
        } else {
            this.eventList = [];
        }
    }

    public emit<T>(eventName: EventName, arg?: T): void {
        const emitEvent =
            this.eventList.filter((eventList) => eventList.name === eventName);
        if (emitEvent.length > 0) {
            emitEvent.forEach((event) => {
                event.callBack(arg);
            });
        } else {
            window.console.log('イベントが登録されていません');
        }
    }
}