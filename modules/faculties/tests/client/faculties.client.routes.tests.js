(function () {
  'use strict';

  describe('Faculties Route Tests', function () {
    // Initialize global variables
    var $scope,
      FacultiesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _FacultiesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      FacultiesService = _FacultiesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('faculties');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/faculties');
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
          FacultiesController,
          mockFaculty;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('faculties.view');
          $templateCache.put('modules/faculties/client/views/view-faculty.client.view.html', '');

          // create mock Faculty
          mockFaculty = new FacultiesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Faculty Name'
          });

          // Initialize Controller
          FacultiesController = $controller('FacultiesController as vm', {
            $scope: $scope,
            facultyResolve: mockFaculty
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:facultyId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.facultyResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            facultyId: 1
          })).toEqual('/faculties/1');
        }));

        it('should attach an Faculty to the controller scope', function () {
          expect($scope.vm.faculty._id).toBe(mockFaculty._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/faculties/client/views/view-faculty.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          FacultiesController,
          mockFaculty;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('faculties.create');
          $templateCache.put('modules/faculties/client/views/form-faculty.client.view.html', '');

          // create mock Faculty
          mockFaculty = new FacultiesService();

          // Initialize Controller
          FacultiesController = $controller('FacultiesController as vm', {
            $scope: $scope,
            facultyResolve: mockFaculty
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.facultyResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/faculties/create');
        }));

        it('should attach an Faculty to the controller scope', function () {
          expect($scope.vm.faculty._id).toBe(mockFaculty._id);
          expect($scope.vm.faculty._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/faculties/client/views/form-faculty.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          FacultiesController,
          mockFaculty;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('faculties.edit');
          $templateCache.put('modules/faculties/client/views/form-faculty.client.view.html', '');

          // create mock Faculty
          mockFaculty = new FacultiesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Faculty Name'
          });

          // Initialize Controller
          FacultiesController = $controller('FacultiesController as vm', {
            $scope: $scope,
            facultyResolve: mockFaculty
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:facultyId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.facultyResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            facultyId: 1
          })).toEqual('/faculties/1/edit');
        }));

        it('should attach an Faculty to the controller scope', function () {
          expect($scope.vm.faculty._id).toBe(mockFaculty._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/faculties/client/views/form-faculty.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
