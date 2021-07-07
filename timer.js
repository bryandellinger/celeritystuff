import EventEmitter from 'events';

class Timer extends EventEmitter {
    constructor(options) {
        super();
        this.elapsed = 0;
        this.runningSince = new Date();
        this.eventName = options.eventName;
        this.autoSaveInterval = (options && options.autoSaveInterval) ? options.autoSaveInterval : 10000;
        this.checkFrequency = (options && options.checkFrequency) ? options.checkFrequency : 1000;
        this.timerInterval = null;
        this.init();
    }

    init() {
        this.timerInterval = setInterval(() => this.updateTimer(), this.checkFrequency);
    }

    updateTimer() {
        this.elapsed = new Date() - this.runningSince;
        if (this.elapsed > this.autoSaveInterval) {
            this.resetTimer();
            this.emit(this.eventName);
        }
    }

    resetTimer() {
        this.elapsed = 0;
        this.runningSince = new Date();
    }

    stopTimer() {
        clearInterval(this.timerInterval);
    }
}
module.exports = Timer;
