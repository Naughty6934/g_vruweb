(function () {
  'use strict';

  // Faculties controller
  angular
    .module('faculties')
    .controller('FacultiesController', FacultiesController);

  FacultiesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'facultyResolve'];

  function FacultiesController ($scope, $state, $window, Authentication, faculty) {
    var vm = this;

    vm.authentication = Authentication;
    vm.faculty = faculty;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Faculty
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.faculty.$remove($state.go('faculties.list'));
      }
    }

    // Save Faculty
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.facultyForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.faculty._id) {
        vm.faculty.$update(successCallback, errorCallback);
      } else {
        vm.faculty.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('faculties.view', {
          facultyId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
