// Scores service used to communicate Scores REST endpoints
(function () {
  'use strict';

  angular
    .module('scores')
    .factory('ScoresService', ScoresService);

  ScoresService.$inject = ['$resource'];

  function ScoresService($resource) {
    return $resource('api/scores/:scoreId', {
      scoreId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
