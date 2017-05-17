'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Professor = mongoose.model('Professor'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  professor;

/**
 * Professor routes tests
 */
describe('Professor CRUD tests', function () {

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

    // Save a user to the test db and create new Professor
    user.save(function () {
      professor = {
        name: 'Professor name'
      };

      done();
    });
  });

  it('should be able to save a Professor if logged in', function (done) {
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

        // Save a new Professor
        agent.post('/api/professors')
          .send(professor)
          .expect(200)
          .end(function (professorSaveErr, professorSaveRes) {
            // Handle Professor save error
            if (professorSaveErr) {
              return done(professorSaveErr);
            }

            // Get a list of Professors
            agent.get('/api/professors')
              .end(function (professorsGetErr, professorsGetRes) {
                // Handle Professors save error
                if (professorsGetErr) {
                  return done(professorsGetErr);
                }

                // Get Professors list
                var professors = professorsGetRes.body;

                // Set assertions
                (professors[0].user._id).should.equal(userId);
                (professors[0].name).should.match('Professor name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Professor if not logged in', function (done) {
    agent.post('/api/professors')
      .send(professor)
      .expect(403)
      .end(function (professorSaveErr, professorSaveRes) {
        // Call the assertion callback
        done(professorSaveErr);
      });
  });

  it('should not be able to save an Professor if no name is provided', function (done) {
    // Invalidate name field
    professor.name = '';

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

        // Save a new Professor
        agent.post('/api/professors')
          .send(professor)
          .expect(400)
          .end(function (professorSaveErr, professorSaveRes) {
            // Set message assertion
            (professorSaveRes.body.message).should.match('Please fill Professor name');

            // Handle Professor save error
            done(professorSaveErr);
          });
      });
  });

  it('should be able to update an Professor if signed in', function (done) {
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

        // Save a new Professor
        agent.post('/api/professors')
          .send(professor)
          .expect(200)
          .end(function (professorSaveErr, professorSaveRes) {
            // Handle Professor save error
            if (professorSaveErr) {
              return done(professorSaveErr);
            }

            // Update Professor name
            professor.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Professor
            agent.put('/api/professors/' + professorSaveRes.body._id)
              .send(professor)
              .expect(200)
              .end(function (professorUpdateErr, professorUpdateRes) {
                // Handle Professor update error
                if (professorUpdateErr) {
                  return done(professorUpdateErr);
                }

                // Set assertions
                (professorUpdateRes.body._id).should.equal(professorSaveRes.body._id);
                (professorUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Professors if not signed in', function (done) {
    // Create new Professor model instance
    var professorObj = new Professor(professor);

    // Save the professor
    professorObj.save(function () {
      // Request Professors
      request(app).get('/api/professors')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Professor if not signed in', function (done) {
    // Create new Professor model instance
    var professorObj = new Professor(professor);

    // Save the Professor
    professorObj.save(function () {
      request(app).get('/api/professors/' + professorObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', professor.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Professor with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/professors/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Professor is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Professor which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Professor
    request(app).get('/api/professors/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Professor with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Professor if signed in', function (done) {
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

        // Save a new Professor
        agent.post('/api/professors')
          .send(professor)
          .expect(200)
          .end(function (professorSaveErr, professorSaveRes) {
            // Handle Professor save error
            if (professorSaveErr) {
              return done(professorSaveErr);
            }

            // Delete an existing Professor
            agent.delete('/api/professors/' + professorSaveRes.body._id)
              .send(professor)
              .expect(200)
              .end(function (professorDeleteErr, professorDeleteRes) {
                // Handle professor error error
                if (professorDeleteErr) {
                  return done(professorDeleteErr);
                }

                // Set assertions
                (professorDeleteRes.body._id).should.equal(professorSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Professor if not signed in', function (done) {
    // Set Professor user
    professor.user = user;

    // Create new Professor model instance
    var professorObj = new Professor(professor);

    // Save the Professor
    professorObj.save(function () {
      // Try deleting Professor
      request(app).delete('/api/professors/' + professorObj._id)
        .expect(403)
        .end(function (professorDeleteErr, professorDeleteRes) {
          // Set message assertion
          (professorDeleteRes.body.message).should.match('User is not authorized');

          // Handle Professor error error
          done(professorDeleteErr);
        });

    });
  });

  it('should be able to get a single Professor that has an orphaned user reference', function (done) {
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

          // Save a new Professor
          agent.post('/api/professors')
            .send(professor)
            .expect(200)
            .end(function (professorSaveErr, professorSaveRes) {
              // Handle Professor save error
              if (professorSaveErr) {
                return done(professorSaveErr);
              }

              // Set assertions on new Professor
              (professorSaveRes.body.name).should.equal(professor.name);
              should.exist(professorSaveRes.body.user);
              should.equal(professorSaveRes.body.user._id, orphanId);

              // force the Professor to have an orphaned user reference
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

                    // Get the Professor
                    agent.get('/api/professors/' + professorSaveRes.body._id)
                      .expect(200)
                      .end(function (professorInfoErr, professorInfoRes) {
                        // Handle Professor error
                        if (professorInfoErr) {
                          return done(professorInfoErr);
                        }

                        // Set assertions
                        (professorInfoRes.body._id).should.equal(professorSaveRes.body._id);
                        (professorInfoRes.body.name).should.equal(professor.name);
                        should.equal(professorInfoRes.body.user, undefined);

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
      Professor.remove().exec(done);
    });
  });
});
