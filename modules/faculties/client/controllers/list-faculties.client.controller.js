(function () {
  'use strict';

  angular
    .module('faculties')
    .controller('FacultiesListController', FacultiesListController);

  FacultiesListController.$inject = ['FacultiesService'];

  function FacultiesListController(FacultiesService) {
    var vm = this;

    vm.faculties = FacultiesService.query();
  }
}());
