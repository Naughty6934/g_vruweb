'use strict';

describe('Authorities E2E Tests:', function () {
  describe('Test Authorities page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/authorities');
      expect(element.all(by.repeater('authority in authorities')).count()).toEqual(0);
    });
  });
});
