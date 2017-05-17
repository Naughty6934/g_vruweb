(function () {
  'use strict';

  describe('Degrees Route Tests', function () {
    // Initialize global variables
    var $scope,
      DegreesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _DegreesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      DegreesService = _DegreesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('degrees');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/degrees');
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
          DegreesController,
          mockDegree;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('degrees.view');
          $templateCache.put('modules/degrees/client/views/view-degree.client.view.html', '');

          // create mock Degree
          mockDegree = new DegreesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Degree Name'
          });

          // Initialize Controller
          DegreesController = $controller('DegreesController as vm', {
            $scope: $scope,
            degreeResolve: mockDegree
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:degreeId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.degreeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            degreeId: 1
          })).toEqual('/degrees/1');
        }));

        it('should attach an Degree to the controller scope', function () {
          expect($scope.vm.degree._id).toBe(mockDegree._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/degrees/client/views/view-degree.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          DegreesController,
          mockDegree;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('degrees.create');
          $templateCache.put('modules/degrees/client/views/form-degree.client.view.html', '');

          // create mock Degree
          mockDegree = new DegreesService();

          // Initialize Controller
          DegreesController = $controller('DegreesController as vm', {
            $scope: $scope,
            degreeResolve: mockDegree
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.degreeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/degrees/create');
        }));

        it('should attach an Degree to the controller scope', function () {
          expect($scope.vm.degree._id).toBe(mockDegree._id);
          expect($scope.vm.degree._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/degrees/client/views/form-degree.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          DegreesController,
          mockDegree;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('degrees.edit');
          $templateCache.put('modules/degrees/client/views/form-degree.client.view.html', '');

          // create mock Degree
          mockDegree = new DegreesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Degree Name'
          });

          // Initialize Controller
          DegreesController = $controller('DegreesController as vm', {
            $scope: $scope,
            degreeResolve: mockDegree
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:degreeId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.degreeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            degreeId: 1
          })).toEqual('/degrees/1/edit');
        }));

        it('should attach an Degree to the controller scope', function () {
          expect($scope.vm.degree._id).toBe(mockDegree._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/degrees/client/views/form-degree.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
