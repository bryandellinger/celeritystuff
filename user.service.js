(function () {
    'use strict';

    angular
        .module('beincharge')
        .factory('userService', userService);

    userService.$inject = [];

    function userService() {
        var service = this;
        service.site = null;
        service.sites = [];
        service.physicians = [];
        service.hasSelectedSite = hasSelectedSite;
        service.assertSelectedSite = assertSelectedSite;

        return service;

        /// public ///
        function hasSelectedSite() {
            return service.site && service.site.SiteId;
        }

        function assertSelectedSite() {
            if (!hasSelectedSite()) {
                var errorText = 'Could not find current location SiteId.';
                headerService.errors.push(errorText);
                throw errorText;
            }
        }
    }

})();