(function () {
  'use strict';

  angular
    .module('scores')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Scores',
      state: 'scores',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'scores', {
      title: 'List Scores',
      state: 'scores.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'scores', {
      title: 'Create Score',
      state: 'scores.create',
      roles: ['user']
    });
  }
}());
