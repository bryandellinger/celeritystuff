(function () {
    'use strict';

    angular
        .module('beincharge.patientdetail')
        .run(appRun);

    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [

            {
                state: 'root.details',
                config: {
                    url: '/patientlist/{patientID}',
                    views: {
                        'bic-display': {
                            controller: 'PatientDetailController as vm',
                            templateUrl: 'Scripts/beincharge/patientdetail/patientdetail.html'
                        },

                        'columnOne@root.details': {
                            controller: 'PatientDetailCardController as vm',
                            templateUrl: 'Scripts/beincharge/patientdetail/patientdetailcard.html'
                        },
                        'columnTwo@root.details':
                        {
                            controller: 'PatientDetailHighChartsController as vm',
                            templateUrl: 'Scripts/beincharge/patientdetail/patientdetaihighcharts.html'
                        }
                    }
                }
            }
        ];
    }

})();
