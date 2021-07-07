import EventEmitter from 'events';
import FormService from '../../services/form.service';
import Toast from '../toast/toast';

const modalTemplate = require('./formListAdmin.completeAllAcceptedForms.modal.handlebars');

/**
 * @class
 * @classdesc Responsible for completing all filtered accepted forms.
 */
class CompleteAllAcceptedForms extends EventEmitter {
    /**
     * @constructor
     * @param  {string} container - the containing div
     * @param  {LoadingIcon} loadingIcon - a loading gif
     * @param  {string} completeAllFormsSelector - JQuery selector used to get array of form ids that are to be completed
     * @param  {string} completeAllFormsButtonSelector -JQuery selector representing the button that launches the complete all forms modal
     */
    constructor(container, loadingIcon, completeAllFormsSelector, completeAllFormsButtonSelector) {
        super();
        this.container = container;
        this.loadingIcon = loadingIcon;
        this.completeAllFormsSelector = completeAllFormsSelector;
        this.completeAllFormsButtonSelector = completeAllFormsButtonSelector;
        this.confirmCompleteAllButtonSelector = '#confirmCompleteAll';
        this.completeAllFormsModalSelector = '#acceptAllModal';
        this.init();
    }

    init() {
        this.initializeCompleteAllButtonListenter();
        this.initializeConfirmCompleteAllButtonListener();
    }

    initializeCompleteAllButtonListenter() {
        $(this.completeAllFormsButtonSelector).click(() => this.buildModal());
    }

    initializeConfirmCompleteAllButtonListener() {
        const getFormsToBeCompleted = () => $(this.completeAllFormsSelector)
            .map(function getforms() {
                return $(this).attr('data-form-id');
            }).get();
        $(this.container).on('click', this.confirmCompleteAllButtonSelector, () => this.completeForms(getFormsToBeCompleted()));
    }

    completeForms(formsToBeCompleted) {
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        this.loadingIcon.show();
        FormService.completeAllAcceptedForms(formsToBeCompleted)
            .then(() => this.completeAllAcceptedFormsSuccess())
            .catch(error => this.completeAllAcceptedFormsError(error));
    }

    completeAllAcceptedFormsSuccess() {
        Toast.success('All accepted forms have been completed');
        this.completeAllAcceptedFormsFinally();
    }

    completeAllAcceptedFormsError(error) {
        Toast.error(error.message || 'An unhandled error occured', 'Error During Processing');
        this.completeAllAcceptedFormsFinally();
    }

    completeAllAcceptedFormsFinally() {
        this.loadingIcon.hide();
        this.emit('reloadData');
    }

    buildModal() {
        const numberOfAcceptedForms = $(this.completeAllFormsSelector).length;
        const thereIsMoreThanOneForm = numberOfAcceptedForms > 1;
        $(this.container).append(modalTemplate({ numberOfAcceptedForms, thereIsMoreThanOneForm }));
        $(this.completeAllFormsModalSelector).modal();
        $(this.completeAllFormsModalSelector).on('hidden.bs.modal', function removeModal() { $(this).remove(); });
    }
}

module.exports = CompleteAllAcceptedForms;
