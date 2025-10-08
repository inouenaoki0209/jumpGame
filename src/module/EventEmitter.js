"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventEmitter = void 0;
class EventEmitter {
    eventList = [];
    static _instance;
    constructor() {
    }
    static getInstance() {
        if (!EventEmitter._instance) {
            EventEmitter._instance = new EventEmitter();
        }
        return EventEmitter._instance;
    }
    addEventLister(eventName, callback) {
        this.eventList.push({ name: eventName, callBack: callback });
    }
    removeEventLister(eventName, callback) {
        const findName = this.eventList.filter(event => event.name !== eventName);
        this.eventList = findName.filter(event => event.callBack !== callback);
    }
    removeAllEventListers(eventName) {
        if (eventName) {
            this.eventList = this.eventList.filter((events) => events.name !== eventName);
        }
        else {
            this.eventList = [];
        }
    }
    emit(eventName, arg) {
        const emitEvent = this.eventList.filter((eventList) => eventList.name === eventName);
        if (emitEvent.length > 0) {
            emitEvent.forEach((event) => {
                event.callBack(arg);
            });
        }
        else {
            window.console.log('イベントが登録されていません');
        }
    }
}
exports.EventEmitter = EventEmitter;
