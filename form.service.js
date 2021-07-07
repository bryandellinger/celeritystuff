import BaseService from './base.service';


export default class FormService extends BaseService {
    /* GET */

    static getQuestions(formId, sectionId) {
        return super.ajaxGet(`${window.CCPBaseUrl}/Form/Questions`, { formId, sectionId });
    }

    static getAdmin(isHistory) {
        return super.ajaxGet(`${window.CCPBaseUrl}/FormListAdmin/Admin/${isHistory}`);
    }

    static getProgress(formId) {
        return super.ajaxGet(`${window.CCPBaseUrl}/Form/PercentageComplete`, { formId });
    }

    static changeStatus(formId, newStatusId) {
        return super.ajaxGet(`${window.CCPBaseUrl}/Form/ChangeStatus`, { formId, newStatusId });
    }

    static unsubmitForm(formId) {
        return super.ajaxGet(`${window.CCPBaseUrl}/Form/Unsubmit`, { formId });
    }

    static getCareTeam(formId) {
        return super.ajaxGet(`${window.CCPBaseUrl}/CareTeam/Get`, { formId });
    }

    static getSections(formId) {
        return super.ajaxGet(`${window.CCPBaseUrl}/Form/Sections`, { formId });
    }

    static getUploadedFiles(formId, sectionQuestionId) {
        return super.ajaxGet(`${window.CCPBaseUrl}/fileupload/getfiledetails`, { formId, sectionQuestionId });
    }

    static getSummary(formId) {
        return super.ajaxGet(`${window.CCPBaseUrl}/form/summary`, { formId });
    }

    static getMyForms() {
        return super.ajaxGet(`${window.CCPBaseUrl}/Formlist/getmyforms`);
    }

    static getHistoricForms() {
        return super.ajaxGet(`${window.CCPBaseUrl}/Formlist/gethistoricforms`);
    }

    static getFormQueue() {
        return super.ajaxGet(`${window.CCPBaseUrl}/Formlist/getformqueue`);
    }

    static getStartableForms() {
        return super.ajaxGet(`${window.CCPBaseUrl}/formlist/getstartableforms`);
    }

    static getInstitutionProfile(formId) {
        return super.ajaxGet(`${window.CCPBaseUrl}/InstitutionProfile/Get`, { formId });
    }

    static getUserProfile(formId, sectionId) {
        return super.ajaxGet(`${window.CCPBaseUrl}/User/GetFormProfileQuestions`, { formId, sectionId });
    }


    /* POST */

    static saveAnswers(saveRequest) {
        return super.ajaxPost(`${window.CCPBaseUrl}/Form/Save`, saveRequest);
    }

    static submitForm(formId, signature) {
        return super.ajaxPost(`${window.CCPBaseUrl}/Form/Submit`, { FormId: formId, FullName: signature });
    }

    static completeAllAcceptedForms(listOfFormIds) {
        return super.ajaxPost(`${window.CCPBaseUrl}/Form/CompleteAllAcceptedForms`, { ListOfFormIds: listOfFormIds });
    }

    static submitCompassForm(formId, signature) {
        return super.ajaxPost(`${window.CCPBaseUrl}/CompassServiceRequest/SubmitForm`, { FormId: formId, FullName: signature });
    }

    static removeUploadedFile(fileUploadId, formId) {
        return super.ajaxPost(`${window.CCPBaseUrl}/fileupload/removefile`, { fileUploadId, formId });
    }

    static confirmCareTeam(careTeam) {
        return super.ajaxPost(`${window.CCPBaseUrl}/CareTeam/Save`, careTeam);
    }

    static unconfirmCareTeam(formId) {
        return super.ajaxPost(`${window.CCPBaseUrl}/CareTeam/Delete`, { formId });
    }

    static confirmInstitutionProfile(organization) {
        return super.ajaxPost(`${window.CCPBaseUrl}/InstitutionProfile/Save`, organization);
    }

    static unconfirmInstitutionProfile(formId) {
        return super.ajaxPost(`${window.CCPBaseUrl}/InstitutionProfile/Delete`, { formId });
    }

    static confirmUserProfile(user) {
        return super.ajaxPost(`${window.CCPBaseUrl}/User/Save`, user);
    }


    /* DELETE */

    static deleteForm(formId) {
        return super.ajaxDelete(`${window.CCPBaseUrl}/Form/Delete`, { formId });
    }
}
