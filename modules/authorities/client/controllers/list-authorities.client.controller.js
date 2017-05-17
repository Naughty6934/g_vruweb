(function () {
  'use strict';

  angular
    .module('authorities')
    .controller('AuthoritiesListController', AuthoritiesListController);

  AuthoritiesListController.$inject = ['AuthoritiesService'];

  function AuthoritiesListController(AuthoritiesService) {
    var vm = this;

    vm.authorities = AuthoritiesService.query();
  }
}());
