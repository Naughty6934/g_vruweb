'use strict';

describe('Degrees E2E Tests:', function () {
  describe('Test Degrees page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/degrees');
      expect(element.all(by.repeater('degree in degrees')).count()).toEqual(0);
    });
  });
});
