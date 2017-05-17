(function () {
  'use strict';

  describe('Bookings Route Tests', function () {
    // Initialize global variables
    var $scope,
      BookingsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _BookingsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      BookingsService = _BookingsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('bookings');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/bookings');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          BookingsController,
          mockBooking;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('bookings.view');
          $templateCache.put('modules/bookings/client/views/view-booking.client.view.html', '');

          // create mock Booking
          mockBooking = new BookingsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Booking Name'
          });

          // Initialize Controller
          BookingsController = $controller('BookingsController as vm', {
            $scope: $scope,
            bookingResolve: mockBooking
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:bookingId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.bookingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            bookingId: 1
          })).toEqual('/bookings/1');
        }));

        it('should attach an Booking to the controller scope', function () {
          expect($scope.vm.booking._id).toBe(mockBooking._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/bookings/client/views/view-booking.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          BookingsController,
          mockBooking;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('bookings.create');
          $templateCache.put('modules/bookings/client/views/form-booking.client.view.html', '');

          // create mock Booking
          mockBooking = new BookingsService();

          // Initialize Controller
          BookingsController = $controller('BookingsController as vm', {
            $scope: $scope,
            bookingResolve: mockBooking
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.bookingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/bookings/create');
        }));

        it('should attach an Booking to the controller scope', function () {
          expect($scope.vm.booking._id).toBe(mockBooking._id);
          expect($scope.vm.booking._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/bookings/client/views/form-booking.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          BookingsController,
          mockBooking;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('bookings.edit');
          $templateCache.put('modules/bookings/client/views/form-booking.client.view.html', '');

          // create mock Booking
          mockBooking = new BookingsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Booking Name'
          });

          // Initialize Controller
          BookingsController = $controller('BookingsController as vm', {
            $scope: $scope,
            bookingResolve: mockBooking
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:bookingId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.bookingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            bookingId: 1
          })).toEqual('/bookings/1/edit');
        }));

        it('should attach an Booking to the controller scope', function () {
          expect($scope.vm.booking._id).toBe(mockBooking._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/bookings/client/views/form-booking.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
