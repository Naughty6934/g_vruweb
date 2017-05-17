(function () {
  'use strict';

  angular
    .module('faculties')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Faculties',
      state: 'faculties',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'faculties', {
      title: 'List Faculties',
      state: 'faculties.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'faculties', {
      title: 'Create Faculty',
      state: 'faculties.create',
      roles: ['user']
    });
  }
}());
