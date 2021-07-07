(function () {
    'use strict';

    angular
        .module('beincharge')
        .run(appRun);

    appRun.$inject = ['routerHelper'];

    function appRun(routerHelper) {
        routerHelper.configureStates(getStates(), '/siteselector');
    }

    function getStates() {
        return [
            {
                state: 'root',
                abstract: true,
                config: {
                    views: {
                        'main@': {
                            template: '<div ui-view="bic-display"></div>'
                        },
                        'bic-header@': {
                            controller: 'HeaderController as vm',
                            templateUrl: 'Scripts/beincharge/header/header.html'
                        }
                    }
                }
            }
        ];
    }

})();
