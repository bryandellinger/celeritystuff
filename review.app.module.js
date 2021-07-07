(function () {
    'use strict';

    angular
        .module('app',
        [
            'ui.router',
            'review.reviewproject',
            'review.form',
            'review.managereviewers',
            'review.manageprograms',
            'review.manageassignments',
            'review.manageactions',
            'review.managecategories',
            'review.reviewerassignments',
            'review.reviewform',
            'review.managescorecategories',
            'review.summary',
            'review.formatting',
            'ngDragDrop',
            'angularjs-dropdown-multiselect',
            'highcharts-ng',
            'ngAnimate',
            'ngSanitize',
            'ui.bootstrap'
        ]).service('interceptor', function ($q, $rootScope, $location, $injector) {
            var service = this;
            var urlservice = $injector.get("loginurlservice");
            service.responseError = function (response) {
                if (response.status == 401 && urlservice && urlservice.url ) {
                    window.location = urlservice.url + "account/login?returnUrl=" + $location.absUrl();
                }
                return $q.reject(response);
            };
        })
        .config(configure);

    configure.$inject = ['routerHelperProvider', '$httpProvider'];

    function configure(routerHelperProvider, $httpProvider) {
        $httpProvider.interceptors.push('interceptor');
        $httpProvider.defaults.headers.common['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.cache = false;

        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};

            var antiForgeryToken = document.getElementsByName("__RequestVerificationToken")[0].value;
            $httpProvider.defaults.headers.common['RequestVerificationToken'] = antiForgeryToken;
        }
        $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
    }

})();