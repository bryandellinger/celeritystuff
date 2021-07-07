(function () {
    'use strict';

    angular
        .module('beincharge.patientdetail')
        .controller('PatientDetailCardController', PatientDetailCardController);

    PatientDetailCardController.$inject = ['patientDataService',
        '$stateParams',
        'headerService',
        'patientDataTransformService',
        'userService'
    ];


    function PatientDetailCardController(patientDataService, $stateParams, headerService, patientDataTransformService, userService) {
        /* jshint validthis:true */
        var vm = this;
        vm.headerService = headerService;
        vm.patient = {};
        vm.patientDataTransformService = patientDataTransformService;
        vm.patientID = $stateParams.patientID;
        vm.patientLoaded = false;
        vm.sessionIsInProgress = sessionIsInProgress;
        vm.sessionList = [];
        vm.userService = userService;


        ///// public /////


        activate();

        function activate() {
            $("[data-toggle='confirmation']").confirmation('hide');
            vm.headerService.errors = [];
            vm.patient = {};
            return getData(vm.patientID).then(function (data) {
                vm.patientLoaded = true;
                vm.patient = data;
                angular.forEach(vm.userService.physicians, function (p, j) {
                    if (p.PhysicianID === vm.patient.PhysicianID) {
                        vm.patient.PhysicianName = p.PhysicianName;
                    }
                });
                vm.sessions = vm.patientDataTransformService.getSessions(data);
                vm.sessionList = [{
                    'column1': '1.',
                    'column2': 'Introduction',
                    'column3': vm.patientDataTransformService.deriveStatus(data.Session1Status, data.Session1Date),
                    'column4': data.Session1Date
                },
                {
                    'column1': '2.',
                    'column2': 'Snack and Parent Attention',
                    'column3': vm.patientDataTransformService.deriveStatus(data.Session2Status, data.Session2Date),
                    'column4': data.Session2Date
                },
                {
                    'column1': '3.',
                    'column2': 'Breakfast and Attention',
                    'column3': vm.patientDataTransformService.deriveStatus(data.Session3Status, data.Session3Date),
                    'column4': data.Session3Date
                },
                {
                    'column1': '4.',
                    'column2': 'Privileges and Time Limits',
                    'column3': vm.patientDataTransformService.deriveStatus(data.Session4Status, data.Session4Date),
                    'column4': data.Session4Date
                },
                {
                    'column1': '5.',
                    'column2': 'Lunch and Introducing New Foods',
                    'column3': vm.patientDataTransformService.deriveStatus(data.Session5Status, data.Session5Date),
                    'column4': data.Session5Date
                },
                {
                    'column1': '6.',
                    'column2': 'Dinner and Combining Behavioral Skills',
                    'column3': vm.patientDataTransformService.deriveStatus(data.Session6Status, data.Session6Date),
                    'column4': data.Session6Date
                },
                {
                    'column1': '7.',
                    'column2': 'Maintaining Gains',
                    'column3': vm.patientDataTransformService.deriveStatus(data.Session7Status, data.Session7Date),
                    'column4': data.Session7Date
                }
                ];
                vm.headerService.configureBreadcrumbs({
                    'title': vm.patient.FirstName + ' ' + vm.patient.LastName + '`s details',
                    'link': 'root.details({ patientID: "' + vm.patientID + '" })',
                    'level': 2
                });

            });  
          
        }

        function sessionIsInProgress(patient, dt, sessionList, index) {
            return patient.CurrentSessionStatus > 0 &&
                !patient.CurrentSessionStart &&
                dt &&
                index < 6 &&
                (!vm.sessionList[index + 1] || !vm.sessionList[index + 1].column4);
        }

        ///data service functions /////////

        function getData(id) {
            return patientDataService.getPatient(id)
                .then(function (data) {
                    return data;
                })
                .catch(function (error) {
                    throw error;
                });
        }

        

    }
})();