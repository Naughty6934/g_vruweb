(function () {
  'use strict';

  angular
    .module('authorities')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('authorities', {
        abstract: true,
        url: '/authorities',
        template: '<ui-view/>'
      })
      .state('authorities.list', {
        url: '',
        templateUrl: 'modules/authorities/client/views/list-authorities.client.view.html',
        controller: 'AuthoritiesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Authorities List'
        }
      })
      .state('authorities.create', {
        url: '/create',
        templateUrl: 'modules/authorities/client/views/form-authority.client.view.html',
        controller: 'AuthoritiesController',
        controllerAs: 'vm',
        resolve: {
          authorityResolve: newAuthority
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Authorities Create'
        }
      })
      .state('authorities.edit', {
        url: '/:authorityId/edit',
        templateUrl: 'modules/authorities/client/views/form-authority.client.view.html',
        controller: 'AuthoritiesController',
        controllerAs: 'vm',
        resolve: {
          authorityResolve: getAuthority
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Authority {{ authorityResolve.name }}'
        }
      })
      .state('authorities.view', {
        url: '/:authorityId',
        templateUrl: 'modules/authorities/client/views/view-authority.client.view.html',
        controller: 'AuthoritiesController',
        controllerAs: 'vm',
        resolve: {
          authorityResolve: getAuthority
        },
        data: {
          pageTitle: 'Authority {{ authorityResolve.name }}'
        }
      });
  }

  getAuthority.$inject = ['$stateParams', 'AuthoritiesService'];

  function getAuthority($stateParams, AuthoritiesService) {
    return AuthoritiesService.get({
      authorityId: $stateParams.authorityId
    }).$promise;
  }

  newAuthority.$inject = ['AuthoritiesService'];

  function newAuthority(AuthoritiesService) {
    return new AuthoritiesService();
  }
}());
