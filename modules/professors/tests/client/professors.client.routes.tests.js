(function () {
  'use strict';

  describe('Professors Route Tests', function () {
    // Initialize global variables
    var $scope,
      ProfessorsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ProfessorsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ProfessorsService = _ProfessorsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('professors');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/professors');
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
          ProfessorsController,
          mockProfessor;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('professors.view');
          $templateCache.put('modules/professors/client/views/view-professor.client.view.html', '');

          // create mock Professor
          mockProfessor = new ProfessorsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Professor Name'
          });

          // Initialize Controller
          ProfessorsController = $controller('ProfessorsController as vm', {
            $scope: $scope,
            professorResolve: mockProfessor
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:professorId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.professorResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            professorId: 1
          })).toEqual('/professors/1');
        }));

        it('should attach an Professor to the controller scope', function () {
          expect($scope.vm.professor._id).toBe(mockProfessor._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/professors/client/views/view-professor.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ProfessorsController,
          mockProfessor;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('professors.create');
          $templateCache.put('modules/professors/client/views/form-professor.client.view.html', '');

          // create mock Professor
          mockProfessor = new ProfessorsService();

          // Initialize Controller
          ProfessorsController = $controller('ProfessorsController as vm', {
            $scope: $scope,
            professorResolve: mockProfessor
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.professorResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/professors/create');
        }));

        it('should attach an Professor to the controller scope', function () {
          expect($scope.vm.professor._id).toBe(mockProfessor._id);
          expect($scope.vm.professor._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/professors/client/views/form-professor.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ProfessorsController,
          mockProfessor;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('professors.edit');
          $templateCache.put('modules/professors/client/views/form-professor.client.view.html', '');

          // create mock Professor
          mockProfessor = new ProfessorsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Professor Name'
          });

          // Initialize Controller
          ProfessorsController = $controller('ProfessorsController as vm', {
            $scope: $scope,
            professorResolve: mockProfessor
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:professorId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.professorResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            professorId: 1
          })).toEqual('/professors/1/edit');
        }));

        it('should attach an Professor to the controller scope', function () {
          expect($scope.vm.professor._id).toBe(mockProfessor._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/professors/client/views/form-professor.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
