(function () {
  'use strict';

  angular
    .module('bookings')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('bookings', {
        abstract: true,
        url: '/bookings',
        template: '<ui-view/>'
      })
      .state('bookings.list', {
        url: '',
        templateUrl: 'modules/bookings/client/views/list-bookings.client.view.html',
        controller: 'BookingsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Bookings List'
        }
      })
      .state('bookings.create', {
        url: '/create',
        templateUrl: 'modules/bookings/client/views/form-booking.client.view.html',
        controller: 'BookingsController',
        controllerAs: 'vm',
        resolve: {
          bookingResolve: newBooking
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Bookings Create'
        }
      })
      .state('bookings.edit', {
        url: '/:bookingId/edit',
        templateUrl: 'modules/bookings/client/views/form-booking.client.view.html',
        controller: 'BookingsController',
        controllerAs: 'vm',
        resolve: {
          bookingResolve: getBooking
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Booking {{ bookingResolve.name }}'
        }
      })
      .state('bookings.view', {
        url: '/:bookingId',
        templateUrl: 'modules/bookings/client/views/view-booking.client.view.html',
        controller: 'BookingsController',
        controllerAs: 'vm',
        resolve: {
          bookingResolve: getBooking
        },
        data: {
          pageTitle: 'Booking {{ bookingResolve.name }}'
        }
      });
  }

  getBooking.$inject = ['$stateParams', 'BookingsService'];

  function getBooking($stateParams, BookingsService) {
    return BookingsService.get({
      bookingId: $stateParams.bookingId
    }).$promise;
  }

  newBooking.$inject = ['BookingsService'];

  function newBooking(BookingsService) {
    return new BookingsService();
  }
}());
