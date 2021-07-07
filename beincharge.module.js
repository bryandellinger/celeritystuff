(function () {
    'use strict';

    angular
        .module('beincharge',
        [
            'ui.router',
            'beincharge.patientdetail',
            'beincharge.patientlist',
            'beincharge.forms',
            'beincharge.siteselector'
        ])
        .config(configure);

    configure.$inject = ['routerHelperProvider'];

    function configure(routerHelperProvider) {
    }

})();