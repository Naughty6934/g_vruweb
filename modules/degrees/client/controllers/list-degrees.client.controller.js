(function () {
  'use strict';

  angular
    .module('degrees')
    .controller('DegreesListController', DegreesListController);

  DegreesListController.$inject = ['DegreesService'];

  function DegreesListController(DegreesService) {
    var vm = this;

    vm.degrees = DegreesService.query();
  }
}());
