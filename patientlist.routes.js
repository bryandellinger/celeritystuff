(function () {
    'use strict';

    angular
        .module('beincharge.patientlist')
        .run(appRun);

    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'root.patient',
                config: {
                    url: '/patientlist',
                    views: {
                        'bic-display': {
                            controller: 'PatientListController as vm',
                            templateUrl: 'Scripts/beincharge/patientlist/patientlist.html'
                        }
                    }
                }
            }
           
        ];
    }

})();
