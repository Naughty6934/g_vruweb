'use strict';

describe('Professors E2E Tests:', function () {
  describe('Test Professors page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/professors');
      expect(element.all(by.repeater('professor in professors')).count()).toEqual(0);
    });
  });
});
