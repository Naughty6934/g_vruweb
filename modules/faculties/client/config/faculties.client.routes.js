(function () {
  'use strict';

  angular
    .module('faculties')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('faculties', {
        abstract: true,
        url: '/faculties',
        template: '<ui-view/>'
      })
      .state('faculties.list', {
        url: '',
        templateUrl: 'modules/faculties/client/views/list-faculties.client.view.html',
        controller: 'FacultiesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Faculties List'
        }
      })
      .state('faculties.create', {
        url: '/create',
        templateUrl: 'modules/faculties/client/views/form-faculty.client.view.html',
        controller: 'FacultiesController',
        controllerAs: 'vm',
        resolve: {
          facultyResolve: newFaculty
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Faculties Create'
        }
      })
      .state('faculties.edit', {
        url: '/:facultyId/edit',
        templateUrl: 'modules/faculties/client/views/form-faculty.client.view.html',
        controller: 'FacultiesController',
        controllerAs: 'vm',
        resolve: {
          facultyResolve: getFaculty
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Faculty {{ facultyResolve.name }}'
        }
      })
      .state('faculties.view', {
        url: '/:facultyId',
        templateUrl: 'modules/faculties/client/views/view-faculty.client.view.html',
        controller: 'FacultiesController',
        controllerAs: 'vm',
        resolve: {
          facultyResolve: getFaculty
        },
        data: {
          pageTitle: 'Faculty {{ facultyResolve.name }}'
        }
      });
  }

  getFaculty.$inject = ['$stateParams', 'FacultiesService'];

  function getFaculty($stateParams, FacultiesService) {
    return FacultiesService.get({
      facultyId: $stateParams.facultyId
    }).$promise;
  }

  newFaculty.$inject = ['FacultiesService'];

  function newFaculty(FacultiesService) {
    return new FacultiesService();
  }
}());
