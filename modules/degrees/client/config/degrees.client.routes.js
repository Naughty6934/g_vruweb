(function () {
  'use strict';

  angular
    .module('degrees')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('degrees', {
        abstract: true,
        url: '/degrees',
        template: '<ui-view/>'
      })
      .state('degrees.list', {
        url: '',
        templateUrl: 'modules/degrees/client/views/list-degrees.client.view.html',
        controller: 'DegreesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Degrees List'
        }
      })
      .state('degrees.create', {
        url: '/create',
        templateUrl: 'modules/degrees/client/views/form-degree.client.view.html',
        controller: 'DegreesController',
        controllerAs: 'vm',
        resolve: {
          degreeResolve: newDegree
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Degrees Create'
        }
      })
      .state('degrees.edit', {
        url: '/:degreeId/edit',
        templateUrl: 'modules/degrees/client/views/form-degree.client.view.html',
        controller: 'DegreesController',
        controllerAs: 'vm',
        resolve: {
          degreeResolve: getDegree
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Degree {{ degreeResolve.name }}'
        }
      })
      .state('degrees.view', {
        url: '/:degreeId',
        templateUrl: 'modules/degrees/client/views/view-degree.client.view.html',
        controller: 'DegreesController',
        controllerAs: 'vm',
        resolve: {
          degreeResolve: getDegree
        },
        data: {
          pageTitle: 'Degree {{ degreeResolve.name }}'
        }
      });
  }

  getDegree.$inject = ['$stateParams', 'DegreesService'];

  function getDegree($stateParams, DegreesService) {
    return DegreesService.get({
      degreeId: $stateParams.degreeId
    }).$promise;
  }

  newDegree.$inject = ['DegreesService'];

  function newDegree(DegreesService) {
    return new DegreesService();
  }
}());
