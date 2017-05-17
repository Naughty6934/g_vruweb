'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Degree = mongoose.model('Degree'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  degree;

/**
 * Degree routes tests
 */
describe('Degree CRUD tests', function () {

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

    // Save a user to the test db and create new Degree
    user.save(function () {
      degree = {
        name: 'Degree name'
      };

      done();
    });
  });

  it('should be able to save a Degree if logged in', function (done) {
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

        // Save a new Degree
        agent.post('/api/degrees')
          .send(degree)
          .expect(200)
          .end(function (degreeSaveErr, degreeSaveRes) {
            // Handle Degree save error
            if (degreeSaveErr) {
              return done(degreeSaveErr);
            }

            // Get a list of Degrees
            agent.get('/api/degrees')
              .end(function (degreesGetErr, degreesGetRes) {
                // Handle Degrees save error
                if (degreesGetErr) {
                  return done(degreesGetErr);
                }

                // Get Degrees list
                var degrees = degreesGetRes.body;

                // Set assertions
                (degrees[0].user._id).should.equal(userId);
                (degrees[0].name).should.match('Degree name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Degree if not logged in', function (done) {
    agent.post('/api/degrees')
      .send(degree)
      .expect(403)
      .end(function (degreeSaveErr, degreeSaveRes) {
        // Call the assertion callback
        done(degreeSaveErr);
      });
  });

  it('should not be able to save an Degree if no name is provided', function (done) {
    // Invalidate name field
    degree.name = '';

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

        // Save a new Degree
        agent.post('/api/degrees')
          .send(degree)
          .expect(400)
          .end(function (degreeSaveErr, degreeSaveRes) {
            // Set message assertion
            (degreeSaveRes.body.message).should.match('Please fill Degree name');

            // Handle Degree save error
            done(degreeSaveErr);
          });
      });
  });

  it('should be able to update an Degree if signed in', function (done) {
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

        // Save a new Degree
        agent.post('/api/degrees')
          .send(degree)
          .expect(200)
          .end(function (degreeSaveErr, degreeSaveRes) {
            // Handle Degree save error
            if (degreeSaveErr) {
              return done(degreeSaveErr);
            }

            // Update Degree name
            degree.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Degree
            agent.put('/api/degrees/' + degreeSaveRes.body._id)
              .send(degree)
              .expect(200)
              .end(function (degreeUpdateErr, degreeUpdateRes) {
                // Handle Degree update error
                if (degreeUpdateErr) {
                  return done(degreeUpdateErr);
                }

                // Set assertions
                (degreeUpdateRes.body._id).should.equal(degreeSaveRes.body._id);
                (degreeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Degrees if not signed in', function (done) {
    // Create new Degree model instance
    var degreeObj = new Degree(degree);

    // Save the degree
    degreeObj.save(function () {
      // Request Degrees
      request(app).get('/api/degrees')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Degree if not signed in', function (done) {
    // Create new Degree model instance
    var degreeObj = new Degree(degree);

    // Save the Degree
    degreeObj.save(function () {
      request(app).get('/api/degrees/' + degreeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', degree.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Degree with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/degrees/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Degree is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Degree which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Degree
    request(app).get('/api/degrees/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Degree with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Degree if signed in', function (done) {
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

        // Save a new Degree
        agent.post('/api/degrees')
          .send(degree)
          .expect(200)
          .end(function (degreeSaveErr, degreeSaveRes) {
            // Handle Degree save error
            if (degreeSaveErr) {
              return done(degreeSaveErr);
            }

            // Delete an existing Degree
            agent.delete('/api/degrees/' + degreeSaveRes.body._id)
              .send(degree)
              .expect(200)
              .end(function (degreeDeleteErr, degreeDeleteRes) {
                // Handle degree error error
                if (degreeDeleteErr) {
                  return done(degreeDeleteErr);
                }

                // Set assertions
                (degreeDeleteRes.body._id).should.equal(degreeSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Degree if not signed in', function (done) {
    // Set Degree user
    degree.user = user;

    // Create new Degree model instance
    var degreeObj = new Degree(degree);

    // Save the Degree
    degreeObj.save(function () {
      // Try deleting Degree
      request(app).delete('/api/degrees/' + degreeObj._id)
        .expect(403)
        .end(function (degreeDeleteErr, degreeDeleteRes) {
          // Set message assertion
          (degreeDeleteRes.body.message).should.match('User is not authorized');

          // Handle Degree error error
          done(degreeDeleteErr);
        });

    });
  });

  it('should be able to get a single Degree that has an orphaned user reference', function (done) {
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

          // Save a new Degree
          agent.post('/api/degrees')
            .send(degree)
            .expect(200)
            .end(function (degreeSaveErr, degreeSaveRes) {
              // Handle Degree save error
              if (degreeSaveErr) {
                return done(degreeSaveErr);
              }

              // Set assertions on new Degree
              (degreeSaveRes.body.name).should.equal(degree.name);
              should.exist(degreeSaveRes.body.user);
              should.equal(degreeSaveRes.body.user._id, orphanId);

              // force the Degree to have an orphaned user reference
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

                    // Get the Degree
                    agent.get('/api/degrees/' + degreeSaveRes.body._id)
                      .expect(200)
                      .end(function (degreeInfoErr, degreeInfoRes) {
                        // Handle Degree error
                        if (degreeInfoErr) {
                          return done(degreeInfoErr);
                        }

                        // Set assertions
                        (degreeInfoRes.body._id).should.equal(degreeSaveRes.body._id);
                        (degreeInfoRes.body.name).should.equal(degree.name);
                        should.equal(degreeInfoRes.body.user, undefined);

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
      Degree.remove().exec(done);
    });
  });
});
