(function () {
    'use strict';

    angular
        .module('beincharge.patientdetail')
        .controller('PatientDetailController', PatientDetailController);

    PatientDetailController.$inject = ['$stateParams', 'headerService'];


    function PatientDetailController($stateParams, headerService) {
        /* jshint validthis:true */
        var vm = this;
        vm.headerService = headerService;
        vm.patientID = $stateParams.patientID;

        ///// public /////

        activate();

        function activate() {
            vm.headerService.showSearch = false;
            return;
        }

    }
})();