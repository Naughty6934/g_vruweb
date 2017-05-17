(function () {
  'use strict';

  // Authorities controller
  angular
    .module('authorities')
    .controller('AuthoritiesController', AuthoritiesController);

  AuthoritiesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'authorityResolve'];

  function AuthoritiesController ($scope, $state, $window, Authentication, authority) {
    var vm = this;

    vm.authentication = Authentication;
    vm.authority = authority;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Authority
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.authority.$remove($state.go('authorities.list'));
      }
    }

    // Save Authority
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.authorityForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.authority._id) {
        vm.authority.$update(successCallback, errorCallback);
      } else {
        vm.authority.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('authorities.view', {
          authorityId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
