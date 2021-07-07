(function () {
    'use strict';

    angular
        .module('beincharge')
        .factory('patientDataService', patientDataService);

    patientDataService.$inject = ['$http', 'headerService', 'userService'];

    function patientDataService($http, headerService, userService) {
        return {
            getData: getData,
            getPatient: getPatient,
            getChartInfo: getChartInfo,
            getUserDay: getUserDay,
            resendInvitation: resendInvitation,
            updateArchived: updateArchived
        };
        
        function getData() {
            userService.assertSelectedSite();

            var dataUrl = "./BeinCharge/patient/" + userService.site.SiteId;
            headerService.errors = [];
            return $http.get(dataUrl)
                .then(getDataComplete)
                .catch(function (error) { return getDataFailed('problem loading patient list ' + error.statusText, error); });
        }

        function getChartInfo(id) {
            userService.assertSelectedSite();

            var dataUrl = "./BeInCharge/chart/" + id + "/" + userService.site.SiteId;
            headerService.errors = [];
            return $http.get(dataUrl)
                .then(getDataComplete)
                .catch(function (error) { return getDataFailed('problem getting chart info' + error.statusText, error); });
        }

        function getUserDay(id, day) {
            var dataUrl = "./BeInCharge/userday/" + userService.site.SiteId +"/" + id + "/" + day.split("T")[0];
            headerService.errors = [];
            return $http.get(dataUrl)
                .then(getDataComplete)
                .catch(function (error) { return getDataFailed('problem getting user day information ' + error.statusText, error); });
        }

        function getPatient(id) {
            userService.assertSelectedSite();

            var dataUrl = "./BeInCharge/getPatient/" + id + "/" + userService.site.SiteId;
            headerService.errors = [];
            return $http.get(dataUrl)
                .then(getDataComplete)
                .catch(function (error) { return getDataFailed('problem getting patient data ' + error.statusText, error); });
        }

        function updateArchived(patient, value) {
            userService.assertSelectedSite();

            var dataObj = {
                ID: patient.ID,
                SiteId: userService.site.SiteId,
                Archived: value
            };
            var dataUrl = "./BeInCharge/updateArchived";
            headerService.errors = [];
            return $http.post(dataUrl, dataObj)
                .then(getDataComplete)
                .catch(function (error) { return getDataFailed('problem updating archived ' + error.statusText, error); });
        }

        function resendInvitation(patient) {
            userService.assertSelectedSite();

            var dataObj = {
                ID: patient.ID,
                SiteId: userService.site.SiteId
            };
            var dataUrl = "./BeInCharge/resendInvitation";
            headerService.errors = [];
            return $http.post(dataUrl, dataObj)
                .then(getDataComplete)
                .catch(function (error) { return getDataFailed('problem resending invitation ' + error.statusText, error); });
        }

        /// private ///

        function getDataComplete(response) {
            return response.data;
        }

        function getDataFailed(message, error) {
            console.log(error);
            headerService.errors.push(message);
            throw error;
        }

    }
})();