(function () {
  'use strict';

  // Bookings controller
  angular
    .module('bookings')
    .controller('BookingsController', BookingsController);

  BookingsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'bookingResolve'];

  function BookingsController ($scope, $state, $window, Authentication, booking) {
    var vm = this;

    vm.authentication = Authentication;
    vm.booking = booking;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Booking
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.booking.$remove($state.go('bookings.list'));
      }
    }

    // Save Booking
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.bookingForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.booking._id) {
        vm.booking.$update(successCallback, errorCallback);
      } else {
        vm.booking.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('bookings.view', {
          bookingId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
