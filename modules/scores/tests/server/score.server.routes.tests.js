'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Score = mongoose.model('Score'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  score;

/**
 * Score routes tests
 */
describe('Score CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Score
    user.save(function () {
      score = {
        name: 'Score name'
      };

      done();
    });
  });

  it('should be able to save a Score if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Score
        agent.post('/api/scores')
          .send(score)
          .expect(200)
          .end(function (scoreSaveErr, scoreSaveRes) {
            // Handle Score save error
            if (scoreSaveErr) {
              return done(scoreSaveErr);
            }

            // Get a list of Scores
            agent.get('/api/scores')
              .end(function (scoresGetErr, scoresGetRes) {
                // Handle Scores save error
                if (scoresGetErr) {
                  return done(scoresGetErr);
                }

                // Get Scores list
                var scores = scoresGetRes.body;

                // Set assertions
                (scores[0].user._id).should.equal(userId);
                (scores[0].name).should.match('Score name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Score if not logged in', function (done) {
    agent.post('/api/scores')
      .send(score)
      .expect(403)
      .end(function (scoreSaveErr, scoreSaveRes) {
        // Call the assertion callback
        done(scoreSaveErr);
      });
  });

  it('should not be able to save an Score if no name is provided', function (done) {
    // Invalidate name field
    score.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Score
        agent.post('/api/scores')
          .send(score)
          .expect(400)
          .end(function (scoreSaveErr, scoreSaveRes) {
            // Set message assertion
            (scoreSaveRes.body.message).should.match('Please fill Score name');

            // Handle Score save error
            done(scoreSaveErr);
          });
      });
  });

  it('should be able to update an Score if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Score
        agent.post('/api/scores')
          .send(score)
          .expect(200)
          .end(function (scoreSaveErr, scoreSaveRes) {
            // Handle Score save error
            if (scoreSaveErr) {
              return done(scoreSaveErr);
            }

            // Update Score name
            score.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Score
            agent.put('/api/scores/' + scoreSaveRes.body._id)
              .send(score)
              .expect(200)
              .end(function (scoreUpdateErr, scoreUpdateRes) {
                // Handle Score update error
                if (scoreUpdateErr) {
                  return done(scoreUpdateErr);
                }

                // Set assertions
                (scoreUpdateRes.body._id).should.equal(scoreSaveRes.body._id);
                (scoreUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Scores if not signed in', function (done) {
    // Create new Score model instance
    var scoreObj = new Score(score);

    // Save the score
    scoreObj.save(function () {
      // Request Scores
      request(app).get('/api/scores')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Score if not signed in', function (done) {
    // Create new Score model instance
    var scoreObj = new Score(score);

    // Save the Score
    scoreObj.save(function () {
      request(app).get('/api/scores/' + scoreObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', score.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Score with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/scores/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Score is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Score which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Score
    request(app).get('/api/scores/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Score with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Score if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Score
        agent.post('/api/scores')
          .send(score)
          .expect(200)
          .end(function (scoreSaveErr, scoreSaveRes) {
            // Handle Score save error
            if (scoreSaveErr) {
              return done(scoreSaveErr);
            }

            // Delete an existing Score
            agent.delete('/api/scores/' + scoreSaveRes.body._id)
              .send(score)
              .expect(200)
              .end(function (scoreDeleteErr, scoreDeleteRes) {
                // Handle score error error
                if (scoreDeleteErr) {
                  return done(scoreDeleteErr);
                }

                // Set assertions
                (scoreDeleteRes.body._id).should.equal(scoreSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Score if not signed in', function (done) {
    // Set Score user
    score.user = user;

    // Create new Score model instance
    var scoreObj = new Score(score);

    // Save the Score
    scoreObj.save(function () {
      // Try deleting Score
      request(app).delete('/api/scores/' + scoreObj._id)
        .expect(403)
        .end(function (scoreDeleteErr, scoreDeleteRes) {
          // Set message assertion
          (scoreDeleteRes.body.message).should.match('User is not authorized');

          // Handle Score error error
          done(scoreDeleteErr);
        });

    });
  });

  it('should be able to get a single Score that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Score
          agent.post('/api/scores')
            .send(score)
            .expect(200)
            .end(function (scoreSaveErr, scoreSaveRes) {
              // Handle Score save error
              if (scoreSaveErr) {
                return done(scoreSaveErr);
              }

              // Set assertions on new Score
              (scoreSaveRes.body.name).should.equal(score.name);
              should.exist(scoreSaveRes.body.user);
              should.equal(scoreSaveRes.body.user._id, orphanId);

              // force the Score to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Score
                    agent.get('/api/scores/' + scoreSaveRes.body._id)
                      .expect(200)
                      .end(function (scoreInfoErr, scoreInfoRes) {
                        // Handle Score error
                        if (scoreInfoErr) {
                          return done(scoreInfoErr);
                        }

                        // Set assertions
                        (scoreInfoRes.body._id).should.equal(scoreSaveRes.body._id);
                        (scoreInfoRes.body.name).should.equal(score.name);
                        should.equal(scoreInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Score.remove().exec(done);
    });
  });
});
