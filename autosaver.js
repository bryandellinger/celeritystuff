import Timer from './timer';
import Toast from './toast/toast';
import overrideConfig from './toast/toast.config.overrideForAutoSave';


class AutoSaver {
    constructor(options) {
        this.section = options.section;
        this.timer = new Timer({ eventName: 'timesUp', autoSaveInterval: 300000, checkFrequency: 10000 });
        this.formId = options.formId;
        this.timerListener = () => { this.saveDirtyForm(); };
        this.setFormtoDirty = () => { this.section.formIsDirty = true; };
        this.init();
    }

    init() {
        this.timer.on('timesUp', this.timerListener);
        this.initializeFormWatcher();
    }

    initializeFormWatcher() {
        $('#section-container').on('change', `#${this.formId}`, this.setFormtoDirty);
        $('#section-container').on('click', `#${this.formId} .chosen-multi-select-actions input`, this.setFormtoDirty);
        $('#section-container').on('keyup', `#${this.formId} input`, this.setFormtoDirty);
        $('#section-container').on('keyup', `#${this.formId} textarea`, this.setFormtoDirty);
    }

    saveDirtyForm() {
        if (this.section.formIsDirty) this.saveForm();
    }

    saveForm() {
        this.section.submitHandler(null, null, false);
        Toast.info('auto save', '', overrideConfig);
    }

    destroy() {
        this.timer.stopTimer();
        this.timer.removeListener('timesUp', this.timerListener);
        this.timer = null;
        $('#section-container').off('change', `#${this.formId}`, this.setFormtoDirty);
        $('#section-container').off('click', `#${this.formId} .chosen-multi-select-actions input`, this.setFormtoDirty);
        $('#section-container').off('keyup', `#${this.formId} input`, this.setFormtoDirty);
        $('#section-container').off('keyup', `#${this.formId} textarea`, this.setFormtoDirty);
        this.section = null;
    }
}
module.exports = AutoSaver;
