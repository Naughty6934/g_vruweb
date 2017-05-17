(function () {
  'use strict';

  angular
    .module('students')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Students',
      state: 'students',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'students', {
      title: 'List Students',
      state: 'students.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'students', {
      title: 'Create Student',
      state: 'students.create',
      roles: ['user']
    });
  }
}());
