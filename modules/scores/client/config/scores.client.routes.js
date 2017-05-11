(function () {
  'use strict';

  angular
    .module('scores')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('scores', {
        abstract: true,
        url: '/scores',
        template: '<ui-view/>'
      })
      .state('scores.list', {
        url: '',
        templateUrl: 'modules/scores/client/views/list-scores.client.view.html',
        controller: 'ScoresListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Scores List'
        }
      })
      .state('scores.create', {
        url: '/create',
        templateUrl: 'modules/scores/client/views/form-score.client.view.html',
        controller: 'ScoresController',
        controllerAs: 'vm',
        resolve: {
          scoreResolve: newScore
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Scores Create'
        }
      })
      .state('scores.edit', {
        url: '/:scoreId/edit',
        templateUrl: 'modules/scores/client/views/form-score.client.view.html',
        controller: 'ScoresController',
        controllerAs: 'vm',
        resolve: {
          scoreResolve: getScore
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Score {{ scoreResolve.name }}'
        }
      })
      .state('scores.view', {
        url: '/:scoreId',
        templateUrl: 'modules/scores/client/views/view-score.client.view.html',
        controller: 'ScoresController',
        controllerAs: 'vm',
        resolve: {
          scoreResolve: getScore
        },
        data: {
          pageTitle: 'Score {{ scoreResolve.name }}'
        }
      });
  }

  getScore.$inject = ['$stateParams', 'ScoresService'];

  function getScore($stateParams, ScoresService) {
    return ScoresService.get({
      scoreId: $stateParams.scoreId
    }).$promise;
  }

  newScore.$inject = ['ScoresService'];

  function newScore(ScoresService) {
    return new ScoresService();
  }
}());
