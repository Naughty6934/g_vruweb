// Professors service used to communicate Professors REST endpoints
(function () {
  'use strict';

  angular
    .module('professors')
    .factory('ProfessorsService', ProfessorsService);

  ProfessorsService.$inject = ['$resource'];

  function ProfessorsService($resource) {
    return $resource('api/professors/:professorId', {
      professorId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
