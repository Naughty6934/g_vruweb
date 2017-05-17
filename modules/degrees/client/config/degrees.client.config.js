(function () {
  'use strict';

  angular
    .module('degrees')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Degrees',
      state: 'degrees',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'degrees', {
      title: 'List Degrees',
      state: 'degrees.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'degrees', {
      title: 'Create Degree',
      state: 'degrees.create',
      roles: ['user']
    });
  }
}());
