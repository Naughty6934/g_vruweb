(function () {
  'use strict';

  angular
    .module('professors')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Professors',
      state: 'professors',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'professors', {
      title: 'List Professors',
      state: 'professors.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'professors', {
      title: 'Create Professor',
      state: 'professors.create',
      roles: ['user']
    });
  }
}());
