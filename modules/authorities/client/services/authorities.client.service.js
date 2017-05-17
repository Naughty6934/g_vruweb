// Authorities service used to communicate Authorities REST endpoints
(function () {
  'use strict';

  angular
    .module('authorities')
    .factory('AuthoritiesService', AuthoritiesService);

  AuthoritiesService.$inject = ['$resource'];

  function AuthoritiesService($resource) {
    return $resource('api/authorities/:authorityId', {
      authorityId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
