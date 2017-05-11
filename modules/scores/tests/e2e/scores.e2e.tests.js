'use strict';

describe('Scores E2E Tests:', function () {
  describe('Test Scores page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/scores');
      expect(element.all(by.repeater('score in scores')).count()).toEqual(0);
    });
  });
});
