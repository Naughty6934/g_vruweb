(function () {
  'use strict';

  angular
    .module('professors')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('professors', {
        abstract: true,
        url: '/professors',
        template: '<ui-view/>'
      })
      .state('professors.list', {
        url: '',
        templateUrl: 'modules/professors/client/views/list-professors.client.view.html',
        controller: 'ProfessorsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Professors List'
        }
      })
      .state('professors.create', {
        url: '/create',
        templateUrl: 'modules/professors/client/views/form-professor.client.view.html',
        controller: 'ProfessorsController',
        controllerAs: 'vm',
        resolve: {
          professorResolve: newProfessor
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Professors Create'
        }
      })
      .state('professors.edit', {
        url: '/:professorId/edit',
        templateUrl: 'modules/professors/client/views/form-professor.client.view.html',
        controller: 'ProfessorsController',
        controllerAs: 'vm',
        resolve: {
          professorResolve: getProfessor
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Professor {{ professorResolve.name }}'
        }
      })
      .state('professors.view', {
        url: '/:professorId',
        templateUrl: 'modules/professors/client/views/view-professor.client.view.html',
        controller: 'ProfessorsController',
        controllerAs: 'vm',
        resolve: {
          professorResolve: getProfessor
        },
        data: {
          pageTitle: 'Professor {{ professorResolve.name }}'
        }
      });
  }

  getProfessor.$inject = ['$stateParams', 'ProfessorsService'];

  function getProfessor($stateParams, ProfessorsService) {
    return ProfessorsService.get({
      professorId: $stateParams.professorId
    }).$promise;
  }

  newProfessor.$inject = ['ProfessorsService'];

  function newProfessor(ProfessorsService) {
    return new ProfessorsService();
  }
}());
