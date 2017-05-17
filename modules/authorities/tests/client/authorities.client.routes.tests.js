(function () {
  'use strict';

  describe('Authorities Route Tests', function () {
    // Initialize global variables
    var $scope,
      AuthoritiesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _AuthoritiesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      AuthoritiesService = _AuthoritiesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('authorities');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/authorities');
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
          AuthoritiesController,
          mockAuthority;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('authorities.view');
          $templateCache.put('modules/authorities/client/views/view-authority.client.view.html', '');

          // create mock Authority
          mockAuthority = new AuthoritiesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Authority Name'
          });

          // Initialize Controller
          AuthoritiesController = $controller('AuthoritiesController as vm', {
            $scope: $scope,
            authorityResolve: mockAuthority
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:authorityId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.authorityResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            authorityId: 1
          })).toEqual('/authorities/1');
        }));

        it('should attach an Authority to the controller scope', function () {
          expect($scope.vm.authority._id).toBe(mockAuthority._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/authorities/client/views/view-authority.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          AuthoritiesController,
          mockAuthority;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('authorities.create');
          $templateCache.put('modules/authorities/client/views/form-authority.client.view.html', '');

          // create mock Authority
          mockAuthority = new AuthoritiesService();

          // Initialize Controller
          AuthoritiesController = $controller('AuthoritiesController as vm', {
            $scope: $scope,
            authorityResolve: mockAuthority
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.authorityResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/authorities/create');
        }));

        it('should attach an Authority to the controller scope', function () {
          expect($scope.vm.authority._id).toBe(mockAuthority._id);
          expect($scope.vm.authority._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/authorities/client/views/form-authority.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          AuthoritiesController,
          mockAuthority;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('authorities.edit');
          $templateCache.put('modules/authorities/client/views/form-authority.client.view.html', '');

          // create mock Authority
          mockAuthority = new AuthoritiesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Authority Name'
          });

          // Initialize Controller
          AuthoritiesController = $controller('AuthoritiesController as vm', {
            $scope: $scope,
            authorityResolve: mockAuthority
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:authorityId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.authorityResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            authorityId: 1
          })).toEqual('/authorities/1/edit');
        }));

        it('should attach an Authority to the controller scope', function () {
          expect($scope.vm.authority._id).toBe(mockAuthority._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/authorities/client/views/form-authority.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
