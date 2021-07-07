import Toast from '../toast/toast';
import formStatusMap from './formListAdmin.mappings';
import LoadingIcon from '../loading-icon/loading-icon';
import FormService from '../../services/form.service';
import CompleteAllAcceptedForms from './formListAdmin.completeAllAcceptedForms';

const mainTemplate = require('./formListAdmin.handlebars');

const completeAllFormsSelector = "button[data-next-status='Complete']";
const completeAllFormsButtonSelector = '.complete-all-accepted-forms';

class FormListAdminBuilder {
    constructor(options) {
        this.baseUrl = options.baseUrl;
        this.container = options.container;
        this.historydata = null;
        this.isHistory = false;
        this.queuedata = null;
        this.loadingIcon = new LoadingIcon('#admin-forms-container');
        this.completeAllAcceptedForms = new CompleteAllAcceptedForms(this.container, this.loadingIcon, completeAllFormsSelector, completeAllFormsButtonSelector);
        this.init();
    }

    addVariablesForTemplate(data) {
        for (let i = 0; i < data.Forms.length; i += 1) {
            const form = data.Forms[i];
            form.allowedStatuses = formStatusMap.get(form.Status).allowedStatuses;
            form.icon = formStatusMap.get(form.Status).icon;
            form.color = (form.Status === 'In Progress' || form.Status === 'Consent Pending') ? '#F0B800' : '#A2B01F';
            form.showPercentComplete = form.Status === 'In Progress';
            form.startedDateShortDateString = new Date(form.StartedDate)
                .toLocaleDateString();
            form.viewLink = `${this.baseUrl}/Form?formId=${form.Id}&isCalledFromAdmin=True`;
            form.printLink = `${this.baseUrl}/Printout/Print?formId=${form.Id}`;
            form.showExternalVariableButton = form.TypeId === 22;
            form.externalVariableLink = `${this.baseUrl}/form/ExternalVariables/${form.Id}`;
        }
    }

    changeStatus(formId, newStatusId) {
        const self = this;
        const myFunction = newStatusId === 2 ? 'unsubmitForm' : 'changeStatus';
        FormService[myFunction](formId, newStatusId)
            .then(() => {
                self.reloadData();
                return null;
            })
            .catch((error) => {
                self.processError(error);
            });
    }

    isMatch(value, match) {
        this.value = value;
        this.match = match;
        if (!value) return false;
        return value.toLowerCase().includes(match.toLowerCase());
    }

    filterCards() {
        const self = this;
        const filter = $('#search')
            .val();
        const filteredObject = Object.assign({}, self.isHistory ? self.historydata : self.queuedata);
        if (filter) {
            filteredObject.Forms = filteredObject.Forms.filter(
                x => self.isMatch(x.Description, filter)
                    || self.isMatch(x.SubmittedBy, filter)
                    || self.isMatch(x.Status, filter)
                    || self.isMatch(x.CareCenterProgramName, filter)
                    || self.isMatch(x.CareCenterProgramTypeName, filter)
                    || self.isMatch(x.TypeName, filter)
                    || self.isMatch(x.CareCenterProgramNumber, filter)
            );
        }
        $(self.container)
            .empty()
            .append(mainTemplate(filteredObject));

        self.setCompleteAllButtonVisibility();

        this.loadingIcon.hide();
    }

    init() {
        this.reloadData();
        this.initializeTabs();
        this.initializeSearch();
        this.initializeChangeStatusButton();
        this.completeAllAcceptedForms.on('reloadData', () => {
            this.reloadData();
        });
    }

    initializeChangeStatusButton() {
        const self = this;
        $(self.container)
            .on('click', '.confirm-change-status', function fnc() {
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
                const id = $(this)
                    .closest('.panel--forms')
                    .attr('data-form-id');
                const newStatusId = $(this)
                    .attr('data-newStatusId');
                self.changeStatus(id, newStatusId);
            });
    }

    initializeSearch() {
        const self = this;
        $('#search')
            .on('input', () => {
                self.filterCards();
            });
    }

    setCompleteAllButtonVisibility() {
        if (this.isHistory || !$(completeAllFormsSelector).length) {
            $(completeAllFormsButtonSelector).hide();
        } else {
            $(completeAllFormsButtonSelector).show();
        }
    }


    initializeTabs() {
        const self = this;
        $('#historyTab, #queueTab').click(function func() {
            self.isHistory = $(this).attr('data-ishistory') === 'true';
            const dataObject = self.isHistory ? 'historydata' : 'queuedata';
            $(this).closest('ul').children('li').removeClass('active');
            $(this).addClass('active');

            self.loadingIcon.show();

            if (self[dataObject]) {
                self.filterCards();
            } else {
                self.reloadData();
            }
        });
    }

    processError(error) {
        Toast.error(error.message || 'An unhandled error occured', 'Error During Processing');

        this.loadingIcon.hide();
    }

    reloadData() {
        const self = this;
        const dataObject = self.isHistory ? 'historydata' : 'queuedata';

        this.loadingIcon.show();

        this.queuedata = null;
        this.historydata = null;
        FormService.getAdmin(self.isHistory)
            .then((data) => {
                self[dataObject] = data;
                self.addVariablesForTemplate(self[dataObject]);
                self.filterCards();
                return null;
            })
            .catch((error) => {
                self.processError(error);
            });
    }
}
module.exports = FormListAdminBuilder;
