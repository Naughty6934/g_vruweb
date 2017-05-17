'use strict';

describe('Faculties E2E Tests:', function () {
  describe('Test Faculties page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/faculties');
      expect(element.all(by.repeater('faculty in faculties')).count()).toEqual(0);
    });
  });
});
