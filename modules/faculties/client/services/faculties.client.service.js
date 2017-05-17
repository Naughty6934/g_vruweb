// Faculties service used to communicate Faculties REST endpoints
(function () {
  'use strict';

  angular
    .module('faculties')
    .factory('FacultiesService', FacultiesService);

  FacultiesService.$inject = ['$resource'];

  function FacultiesService($resource) {
    return $resource('api/faculties/:facultyId', {
      facultyId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
