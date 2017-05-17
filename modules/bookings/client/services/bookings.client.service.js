// Bookings service used to communicate Bookings REST endpoints
(function () {
  'use strict';

  angular
    .module('bookings')
    .factory('BookingsService', BookingsService);

  BookingsService.$inject = ['$resource'];

  function BookingsService($resource) {
    return $resource('api/bookings/:bookingId', {
      bookingId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
