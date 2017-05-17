// Degrees service used to communicate Degrees REST endpoints
(function () {
  'use strict';

  angular
    .module('degrees')
    .factory('DegreesService', DegreesService);

  DegreesService.$inject = ['$resource'];

  function DegreesService($resource) {
    return $resource('api/degrees/:degreeId', {
      degreeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
