(function () {
  'use strict';

  // Professors controller
  angular
    .module('professors')
    .controller('ProfessorsController', ProfessorsController);

  ProfessorsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'professorResolve'];

  function ProfessorsController ($scope, $state, $window, Authentication, professor) {
    var vm = this;

    vm.authentication = Authentication;
    vm.professor = professor;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Professor
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.professor.$remove($state.go('professors.list'));
      }
    }

    // Save Professor
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.professorForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.professor._id) {
        vm.professor.$update(successCallback, errorCallback);
      } else {
        vm.professor.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('professors.view', {
          professorId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
