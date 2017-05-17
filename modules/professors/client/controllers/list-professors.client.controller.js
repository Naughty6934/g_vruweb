(function () {
  'use strict';

  angular
    .module('professors')
    .controller('ProfessorsListController', ProfessorsListController);

  ProfessorsListController.$inject = ['ProfessorsService'];

  function ProfessorsListController(ProfessorsService) {
    var vm = this;

    vm.professors = ProfessorsService.query();
  }
}());
