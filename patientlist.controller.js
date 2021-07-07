(function () {
    'use strict';

    angular
        .module('beincharge.patientlist')
        .controller('PatientListController', PatientListController);

    PatientListController.$inject = ['patientDataService', '$filter', 'headerService', '$state', 'patientDataTransformService', '$timeout', 'userService', '$scope', '$rootScope'
    ];


    function PatientListController(patientDataService, $filter, headerService, $state, patientDataTransformService, $timeout, userService) {
        /* jshint validthis:true */
        var vm = this;
        vm.currentSort = '';
        vm.convertLastActivitySecondstoDays = convertLastActivitySecondstoDays;
        vm.convertLastActivitySecondstoHours = convertLastActivitySecondstoHours;
        vm.convertLastActivitySecondstoMinutes = convertLastActivitySecondstoMinutes;
        vm.convertLastActivitySecondstoMonths = convertLastActivitySecondstoMonths;
        vm.convertLastActivitySecondstoWeeks = convertLastActivitySecondstoWeeks;
        vm.convertLastActivitySecondstoYears = convertLastActivitySecondstoYears;
        vm.errorOccuredLoadingPatients = false;
        vm.getLastLoggedOnText = getLastLoggedOnText;
        vm.getProgramStatusIsHidden = getProgramStatusIsHidden;
        vm.getProgamStatusTextColor = getProgamStatusTextColor;
        vm.getSessionDateColor = getSessionDateColor;
        vm.getSessionIsHidden = getSessionIsHidden;
        vm.goToDetails = goToDetails;
        vm.headerService = headerService;
        vm.patientlist = [];
        vm.patientDataTransformService = patientDataTransformService;
        vm.patientsLoaded = false;
        vm.resendInvitation = resendInvitation;
        vm.sessionIsInProgress = sessionIsInProgress;
        vm.setArchived = setArchived;
        vm.setCurrentSort = setCurrentSort;
        vm.showSpinner = false;
        vm.sortOptions = [];
        vm.userService = userService;

     

        // activate //
       

        activate();

        function activate() {
            vm.headerService.Archived  = false;
            vm.headerService.selectedPhysician = '';
            vm.headerService.searchText = '';
            
                    
            $('body').confirmation({
                rootSelector: 'body',
                selector: '[data-toggle=confirmation]',
                container: 'body',
                onConfirm: function () {
                    var id = $(this)[0].getAttribute('data-id');
                    $timeout(function () {
                        angular.element('#' + id + '').triggerHandler('click');
                    },0);
                }
            });

            $('html').on('mouseup', function (e) {
                if ($(e.target).closest(".popover").length === 0) {
                    var attr = $(e.target).attr('data-toggle');
                    var isProp = typeof attr !== typeof undefined && attr !== false;
                    if (!isProp) {
                        $("[data-toggle='confirmation']").confirmation('hide');
                    }
                }
                });
           

            vm.headerService.showSearch = true;

            vm.sortOptions = [{
                'text': 'Patient',
                'orderBy': 'LastName',
                'sortDescending': true
            },
            {
                'text': 'Physician',
                'orderBy': 'PhysicianLastName',
                'sortDescending': true
            },
            {
                'text': 'Last Login',
                'orderBy': 'derivedLastActivitySeconds',
                'sortDescending': true
            }
            ];

            vm.currentSort = vm.sortOptions[0];

            vm.headerService.configureBreadcrumbs({
                'title': 'patients',
                'link': 'root.patient',
                'level': 1
            });
            vm.headerService.physicians = [];

            return getData();
        }

        ///// public /////

        function setCurrentSort(sortOption) {
            vm.currentSort = sortOption;
            vm.currentSort.sortDescending = !vm.currentSort.sortDescending;
            vm.patientlist = $filter('orderBy')(vm.patientlist, sortOption.orderBy, sortOption.sortDescending);
        }



        function getSessionDateColor(session) {
            return session.statusCode === 2 ? "text-success" :
                session.statusCode === 1 ? "text-danger" : "";
        }

        function getSessionIsHidden(session) {
            return session.statusCode === 0;
        }

        function getProgamStatusTextColor(programStatus) {
            return (programStatus||' ').indexOf('Program Completed') >= 0 ? "text-success" : "";
        }

        function getProgramStatusIsHidden(programStatus) {
            return !programStatus || programStatus === 'insession';
        }

        function convertLastActivitySecondstoMinutes(ActivitySeconds) {
            return ActivitySeconds / 60 > 1 ? ActivitySeconds / 60 : '';
        }

        function convertLastActivitySecondstoHours(ActivitySeconds) {
            return convertLastActivitySecondstoMinutes(ActivitySeconds) >= 1 ? convertLastActivitySecondstoMinutes(ActivitySeconds) / 60 : '';
        }

        function convertLastActivitySecondstoDays(ActivitySeconds) {
            return convertLastActivitySecondstoHours(ActivitySeconds) >= 24 ? convertLastActivitySecondstoHours(ActivitySeconds) / 24 : '';
        }

        function convertLastActivitySecondstoWeeks(ActivitySeconds) {
            return convertLastActivitySecondstoDays(ActivitySeconds) >= 7 ? convertLastActivitySecondstoDays(ActivitySeconds) / 7 : '';
        }

        function convertLastActivitySecondstoMonths(ActivitySeconds) {
            return convertLastActivitySecondstoDays(ActivitySeconds) >= 30 ? convertLastActivitySecondstoDays(ActivitySeconds) / 30 : '';
        }

        function convertLastActivitySecondstoYears(ActivitySeconds) {
            return convertLastActivitySecondstoDays(ActivitySeconds) >= 365 ? convertLastActivitySecondstoDays(ActivitySeconds) / 365 : '';
        }

        function getLastLoggedOnText(ActivitySeconds) {
            var x;
            if (ActivitySeconds <= 0 || (ActivitySeconds > 0 && convertLastActivitySecondstoYears(ActivitySeconds) > 20) ) {
                return "Never Logged On";
            }
            if (convertLastActivitySecondstoYears(ActivitySeconds) >= 1) {
                x = Math.floor(convertLastActivitySecondstoYears(ActivitySeconds));
                return x + ' Year' + (x > 1 ? 's' : '') + ' Ago';
            }
            if (convertLastActivitySecondstoMonths(ActivitySeconds) >= 1) {
                x = Math.floor(convertLastActivitySecondstoMonths(ActivitySeconds));
                return x + ' Month' + (x > 1 ? 's' : '') + ' Ago';
            }
            if (convertLastActivitySecondstoWeeks(ActivitySeconds) >= 2) {
                return Math.floor(convertLastActivitySecondstoWeeks(ActivitySeconds)) + ' Weeks Ago';
            }
            if (convertLastActivitySecondstoDays(ActivitySeconds) >= 1) {
                x = Math.floor(convertLastActivitySecondstoDays(ActivitySeconds));
                 return x + ' Day' + (x > 1 ? 's' : '') + ' Ago';
            }
            if (convertLastActivitySecondstoHours(ActivitySeconds) >= 1) {
                x = Math.floor(convertLastActivitySecondstoHours(ActivitySeconds));
                return x + ' Hour' + (x > 1 ? 's' : '') + ' Ago';
            }
            if (convertLastActivitySecondstoMinutes(ActivitySeconds) >= 1) {
                x = Math.floor(convertLastActivitySecondstoMinutes(ActivitySeconds));
                return x + ' Minute' + (x > 1 ? 's' : '') + ' Ago';
            }
            return ActivitySeconds + ' Seconds Ago';

        }

        function setArchived(patient, value) {
            vm.showSpinner = true;
            vm.errorMessage = '';
            return updateArchived(patient, value).then(function () {
                vm.showSpinner = false;
                patient.Archived = value;
                toastr.success(patient.FirstName + ' ' + patient.LastName + ' has been set to ' + (value === 'true' ? 'Archived' : 'Active'), 'Success!',
                    {
                        timeOut: 5000
                    });
            })
                .catch(function (error) {
                    vm.showSpinner = false;
                    toastr.error(vm.headerService.errors[0], 'Error Processing ' + patient.FirstName + ' ' + patient.LastName, {
                        timeOut: 5000
                    });
                });
        }

        function resendInvitation(patient) {
            return resendInvitationInternal(patient).then(function () {
                vm.showSpinner = false;
              //  patient.Status = 'The invitation was resent at ' + new Date().getHours() + ":" + new Date().getMinutes();
                toastr.success(patient.FirstName + ' ' + patient.LastName + ' has been set to been sent an invitation.', 'Invitation resent!',
                    {
                        timeOut: 5000
                    });
            })
                .catch(function (error) {
                    vm.showSpinner = false;
                    toastr.error(vm.headerService.errors[0], 'Error Processing ' + patient.FirstName + ' ' + patient.LastName, {
                        timeOut: 5000
                    });
                    return false;
                });
        }

        function goToDetails(patient) {
            $("[data-toggle='confirmation']").confirmation('hide');
            $state.go('root.details', {
                patientID: patient.ID
            });
        }

        function sessionIsInProgress(name, patient) {       
            return name === 'Current Session' && patient.CurrentSessionStatus > 0 && !patient.CurrentSessionStart;
        }

        ///data service functions /////////

        function getData() {
            return patientDataService.getData()
                .then(function (data) {
                    vm.patientlist = data;
                    angular.forEach(vm.patientlist, function (d, i) {
                        angular.forEach(vm.userService.physicians, function (p, j) {
                            if (p.PhysicianID === d.PhysicianID) {
                                d.PhysicianName = p.PhysicianName;
                            }
                        });
                        d.PhysicianLastName = d.PhysicianName.split(" ").slice(-1);
                        d.PatientFullName = d.FirstName + ' ' + d.LastName;
                        d.invitationResent = false;
                        d.sessions = vm.patientDataTransformService.getSessions(data[i]);
                        d.derivedLastActivitySeconds = parseInt(deriveLastActivitySeconds(data[i].LastActivitySeconds, data[i].LastActivityDate));
                        if (headerService.physicians.map(function (a) {
                            return a.PhysicianID;
                        }).indexOf(d.PhysicianID) === -1) {
                            headerService.physicians.push({
                                'PhysicianID': d.PhysicianID,
                                'PhysicianName': d.PhysicianName,
                                'PhysicianLastName': d.PhysicianLastName
                            });
                        }

                    });
                    headerService.physicians = $filter('orderBy')(headerService.physicians, 'PhysicianLastName');
                    headerService.physicians.unshift({
                        'PhysicianId': '',
                        'PhysicianName': 'All Physicians',
                        'PhysicianLastName': ''
                    });
                    headerService.selectedPhysician = headerService.physicians[0];
                    vm.setCurrentSort(vm.currentSort);
                    vm.patientsLoaded = true;
                    return vm.patientlist;
                }).catch(function (error) {
                    toastr.error(vm.headerService.errors[0], 'Error Loading Patients',  {
                        timeOut: 5000
                    });
                    vm.errorOccuredLoadingPatients = true;
                    vm.patientsLoaded = true;
                });
        }

        function updateArchived(patient, value) {
            return patientDataService.updateArchived(patient, value)
                .then(function (data) {
                    return;
                })
                .catch(function (error) {
                    throw error;
                });
        }

        function resendInvitationInternal(patient) {
            return patientDataService.resendInvitation(patient)
                .then(function (data) {
                    return;
                })
                .catch(function (error) {
                    throw error;
                });
        }
    }

    //private//

    function deriveLastActivitySeconds(LastActivitySeconds, LastActivityDate) {

        return LastActivitySeconds > 0 ? LastActivitySeconds : Math.ceil((new Date().getTime() - new Date(LastActivityDate).getTime()) / 1000);
     
    }

})();