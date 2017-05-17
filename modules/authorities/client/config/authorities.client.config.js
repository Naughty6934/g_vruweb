(function () {
  'use strict';

  angular
    .module('authorities')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Authorities',
      state: 'authorities',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'authorities', {
      title: 'List Authorities',
      state: 'authorities.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'authorities', {
      title: 'Create Authority',
      state: 'authorities.create',
      roles: ['user']
    });
  }
}());
