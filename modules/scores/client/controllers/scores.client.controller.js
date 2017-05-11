(function () {
  'use strict';

  // Scores controller
  angular
    .module('scores')
    .controller('ScoresController', ScoresController);

  ScoresController.$inject = ['$scope', '$state', '$window', 'Authentication', 'scoreResolve'];

  function ScoresController ($scope, $state, $window, Authentication, score) {
    var vm = this;

    vm.authentication = Authentication;
    vm.score = score;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Score
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.score.$remove($state.go('scores.list'));
      }
    }

    // Save Score
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.scoreForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.score._id) {
        vm.score.$update(successCallback, errorCallback);
      } else {
        vm.score.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('scores.view', {
          scoreId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
