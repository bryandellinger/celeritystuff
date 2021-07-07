<style>

</style>
<div>
    <div ng-hide="vm.patientLoaded">
        Loading Patient's Details... <i class="fa fa-spinner fa-spin"></i>
    </div>
</div>
<div class="patient-detail-card" ng-show="vm.patientLoaded">

    <h3 class="text-center strong">
        <a ui-sref="root.newaccount({patientID: vm.patientID, caregiverID: 0, editPatient: true})" title="edit patient" class="edit-patient-pencil">
            <svg fill="#8B597E" class="icon icon--inline" aria-hidden="true">
                <use xmlns:xlink="http://www.w3.org/1999/xlink"
                     xlink:href="#icon-mode_edit"></use>
            </svg>
        </a>
        {{vm.patient.FirstName}} {{vm.patient.LastName}}
       
    </h3>
	<div class="text-center" style="padding-bottom: 10px;">
		BIC ID: {{vm.patient.BICID}}
	</div>
    <div class="rating text-center">
        <span ng-repeat="sessionStatus in vm.patientDataTransformService.getSessionStatusList(vm.patient) track by $index">
            <i class="fa fa-circle"
               ng-class="vm.patientDataTransformService.getSessionStatusIconColor(sessionStatus, false)"
               ng-hide="vm.patientDataTransformService.getSessionStatusIconIsHidden(sessionStatus, false)"
               aria-hidden="true"></i>
        </span>
    </div>

    <div class="date-summary text-center">
        <div><strong>{{vm.patient.PhysicianName}}</strong></div>
        <div>BIC Start Date: {{vm.patient.CreatedDate| date: 'M/d/yy'}}</div>
        <div>Last Sign In: {{vm.patient.LastActivityDate| date: 'M/d/yy'}}</div>
    </div>



    <div class="session-list">
        <div class="row" ng-repeat="item in vm.sessionList">
            <div class="col-xs-1">{{item.column1}}</div>
            <div class="col-xs-7">{{item.column2}}</div>
            <div class="col-xs-4 pull-right" ng-class="vm.patientDataTransformService.getSessionStatusIconColor(item.column3, true)">
             <span ng-show="vm.sessionIsInProgress(vm.patient, item.column4, vm.sessionList, $index )" class="text-success">
              In Progress
             </span>
                <span ng-hide="vm.sessionIsInProgress(vm.patient, item.column4, vm.sessionList, $index )">
                    {{item.column4 | date: 'M/d/yy' }}
                </span>
                     
            </div>
        </div>
    </div>

    <div class="caregivers">
        <div class="caregiver">
            <span>
                <svg fill="#9bdeff" class="icon icon--inline-larger" aria-hidden="true">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-perm_identity"></use>
                </svg>
            </span> Primary Caregiver
        </div>
        <div class="caregiver-info" ng-repeat="item in vm.patient.Caregivers | filter : {'Type' : 'Primary'} ">
            <div class="row">
                <div class="col-xs-1">
                    <a ui-sref="root.newaccount({patientID: vm.patientID, caregiverID: item.ID, editPatient: false})" title="edit primary caregiver">
                        <svg fill="#009CDC" class="icon icon--inline-larger" aria-hidden="true">
                            <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                 xlink:href="#icon-mode_edit"></use>
                        </svg>
                    </a>
                </div>
                <div class="col-xs-11">
                    {{item.FName}} {{item.LName}}
                    ({{item.RelationshipName}})
                </div>

            </div>
            <div class="row">
                <div class="col-xs-11 col-xs-offset-1">{{item.Phone}}</div>
            </div>
            <div class="row">
                <div class="col-xs-11 col-xs-offset-1"><a href="mailto:{{item.Email}}">{{item.Email}}</a></div>
            </div>
        </div>


        <div class="caregiver">
            <span>
                <svg fill="#9bdeff" class="icon icon--inline-larger" aria-hidden="true">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-supervisor_account"></use>
                </svg>
            </span> Other Caregiver(s)
        </div>
        <div class="caregiver-info">
            <div ng-repeat="item in vm.patient.Caregivers | filter : {'Type' : 'Secondary'} ">
                <div class="row">
                    <div class="col-xs-1">
                        <a ui-sref="root.newaccount({patientID: vm.patientID, caregiverID: item.ID, editPatient: false})" title="edit caregiver">
                            <svg fill="#009CDC" class="icon icon--inline-larger" aria-hidden="true">
                                <use xmlns:xlink="http://www.w3.org/1999/xlink"
                                     xlink:href="#icon-mode_edit"></use>
                            </svg>
                        </a>
                    </div>
                  
                    <div class="col-xs-11">
                        {{item.FName}} {{item.LName}} ({{item.RelationshipName}}) 
                    </div>

                </div>
            </div>
        </div>
        <div class="row spacer"></div>
        <a ui-sref="root.newaccount({patientID: vm.patientID, caregiverID: '0', editPatient: false})"
           class="btn btn-primary btn-block btn-lg add-caregiver">
            <svg fill="#FFFFFF" class="icon icon--inline-larger"
                 aria-hidden="true">
                <use xmlns:xlink="http://www.w3.org/1999/xlink"
                     xlink:href="#icon-person_add"></use>
            </svg>
            Add Caregiver
        </a>
    </div>
</div>
  