(function () {
  'use strict';

  angular
    .module('scores')
    .controller('ScoresListController', ScoresListController);

  ScoresListController.$inject = ['ScoresService'];

  function ScoresListController(ScoresService) {
    var vm = this;

    vm.scores = ScoresService.query();
  }
}());
