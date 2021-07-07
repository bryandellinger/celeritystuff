
const formStatusMap = new Map([
    ['In Progress',
        {
            statusId: 2,
            icon: '#icon-autorenew',
            allowedStatuses: [
                {
                    nextStatus: '', newStatusId: null, changeStatusButtonText: '', modalText: ''
                }
            ]
        }
    ],
    ['Submitted',
        {
            statusId: 4,
            icon: '#icon-send',
            allowedStatuses: [
                {
                    nextStatus: 'Accepted',
                    newStatusId: 5,
                    changeStatusButtonText: 'Accept',
                    modalText: 'Are you sure you want to change the status from Submitted to Accepted?\r\nAccepted forms can no longer be modified by the submitter.'
                },
                {
                    nextStatus: 'In Progress',
                    newStatusId: 2,
                    changeStatusButtonText: 'Unsubmit',
                    modalText: 'Are you sure you want to send this form back to the user?\r\nUnsubmitted forms must be submitted by the user to appear in this list again.'
                }
            ]
        }
    ],
    ['Accepted',
        {
            statusId: 5,
            icon: '#icon-check',
            allowedStatuses: [
                {
                    nextStatus: 'Complete',
                    newStatusId: 9,
                    changeStatusButtonText: 'Complete',
                    modalText: 'Are you sure you want to change the status from Accepted to Complete?\r\nCompleted form will no longer appear in the Form Queue tab, they will appear in the History tab.'
                },
                {
                    nextStatus: 'Submitted',
                    newStatusId: 4,
                    changeStatusButtonText: 'Return to Submitted',
                    modalText: 'Are you sure you want to change the status from Accepted to Submitted?\r\nSubmitted forms may be un-submitted by the submitter, removing them from this list.'
                }
            ]
        }
    ],
    ['Closed by Admin',
        {
            statusId: 6,
            icon: '',
            allowedStatuses: [
                {
                    nextStatus: '', newStatusId: null, changeStatusButtonText: '', modalText: ''
                }
            ]
        }
    ],
    ['Consent Pending',
        {
            statusId: 8,
            icon: '',
            allowedStatuses: [
                {
                    nextStatus: '', newStatusId: null, changeStatusButtonText: '', modalText: ''
                }
            ]
        }
    ],
    ['Complete',
        {
            statusId: 9,
            icon: '#icon-archive',
            allowedStatuses: [
                {
                    nextStatus: 'Accepted',
                    newStatusId: 5,
                    changeStatusButtonText: 'Accept',
                    modalText: 'Are you sure you want to change the status from Complete to Accepted?\r\nAccepted forms will appear in the Form Queue tab.'
                }
            ]
        }
    ]
]);
module.exports = formStatusMap;
