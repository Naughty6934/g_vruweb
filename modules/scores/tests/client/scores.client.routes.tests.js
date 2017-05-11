(function () {
  'use strict';

  describe('Scores Route Tests', function () {
    // Initialize global variables
    var $scope,
      ScoresService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ScoresService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ScoresService = _ScoresService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('scores');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/scores');
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
          ScoresController,
          mockScore;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('scores.view');
          $templateCache.put('modules/scores/client/views/view-score.client.view.html', '');

          // create mock Score
          mockScore = new ScoresService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Score Name'
          });

          // Initialize Controller
          ScoresController = $controller('ScoresController as vm', {
            $scope: $scope,
            scoreResolve: mockScore
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:scoreId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.scoreResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            scoreId: 1
          })).toEqual('/scores/1');
        }));

        it('should attach an Score to the controller scope', function () {
          expect($scope.vm.score._id).toBe(mockScore._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/scores/client/views/view-score.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ScoresController,
          mockScore;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('scores.create');
          $templateCache.put('modules/scores/client/views/form-score.client.view.html', '');

          // create mock Score
          mockScore = new ScoresService();

          // Initialize Controller
          ScoresController = $controller('ScoresController as vm', {
            $scope: $scope,
            scoreResolve: mockScore
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.scoreResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/scores/create');
        }));

        it('should attach an Score to the controller scope', function () {
          expect($scope.vm.score._id).toBe(mockScore._id);
          expect($scope.vm.score._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/scores/client/views/form-score.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ScoresController,
          mockScore;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('scores.edit');
          $templateCache.put('modules/scores/client/views/form-score.client.view.html', '');

          // create mock Score
          mockScore = new ScoresService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Score Name'
          });

          // Initialize Controller
          ScoresController = $controller('ScoresController as vm', {
            $scope: $scope,
            scoreResolve: mockScore
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:scoreId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.scoreResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            scoreId: 1
          })).toEqual('/scores/1/edit');
        }));

        it('should attach an Score to the controller scope', function () {
          expect($scope.vm.score._id).toBe(mockScore._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/scores/client/views/form-score.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
