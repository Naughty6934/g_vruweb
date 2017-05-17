(function () {
  'use strict';

  angular
    .module('courses')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Courses',
      state: 'courses',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'courses', {
      title: 'List Courses',
      state: 'courses.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'courses', {
      title: 'Create Course',
      state: 'courses.create',
      roles: ['user']
    });
  }
}());
