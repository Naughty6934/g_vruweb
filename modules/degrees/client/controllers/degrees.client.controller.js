(function () {
  'use strict';

  // Degrees controller
  angular
    .module('degrees')
    .controller('DegreesController', DegreesController);

  DegreesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'degreeResolve'];

  function DegreesController ($scope, $state, $window, Authentication, degree) {
    var vm = this;

    vm.authentication = Authentication;
    vm.degree = degree;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Degree
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.degree.$remove($state.go('degrees.list'));
      }
    }

    // Save Degree
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.degreeForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.degree._id) {
        vm.degree.$update(successCallback, errorCallback);
      } else {
        vm.degree.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('degrees.view', {
          degreeId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
