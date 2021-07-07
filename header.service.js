(function () {
    'use strict';

    angular
        .module('beincharge')
        .factory('headerService', headerService);

    headerService.$inject = [];

    function headerService() {
        var service = this;
        service.Archived = false;
        service.breadcrumbs = [];
        service.configureBreadcrumbs = configureBreadcrumbs;
        service.currentSort = '';
        service.errors = [];
        service.physicians = [];
        service.searchText = '';
        service.selectedPhysician = '';
        service.showSearch = true;
        service.sortOptions = [];
        return service;

        //functions//

        function configureBreadcrumbs(options) {
            /*
        -------------------options-------------------------
        @title the text displayed on the breadcrumb required
        @link the link for the breadcrumb required,
        @level the tree level of the page optional default level 2,
          if the level is one all breadcumbs will first be deleted
          if the level is two all level two and higher first deleted
          if the level is three all level three and higher first deleted etc.
       @appendIndicator optional, default false
          if this is set to true links will be appended at the same level, otherwise links at
          the same level will first be deleted
      */
            var level = options.level || 2;
            for (var i = service.breadcrumbs.length - 1; i >= 0; i--) {
                if (service.breadcrumbs[i].level > level || !options.appendIndicator && service.breadcrumbs[i].level === level) {
                    service.breadcrumbs.splice(i, 1);
                }
            }

            if (service.breadcrumbs.map(function (a) {
                return a.title;
            }).indexOf(options.title) === -1) {
                service.breadcrumbs.push({
                    'title': options.title,
                    'link': options.link,
                    'level': level
                });
            }
        }

    }


})();