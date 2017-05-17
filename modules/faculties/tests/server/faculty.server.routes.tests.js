'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Faculty = mongoose.model('Faculty'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  faculty;

/**
 * Faculty routes tests
 */
describe('Faculty CRUD tests', function () {

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

    // Save a user to the test db and create new Faculty
    user.save(function () {
      faculty = {
        name: 'Faculty name'
      };

      done();
    });
  });

  it('should be able to save a Faculty if logged in', function (done) {
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

        // Save a new Faculty
        agent.post('/api/faculties')
          .send(faculty)
          .expect(200)
          .end(function (facultySaveErr, facultySaveRes) {
            // Handle Faculty save error
            if (facultySaveErr) {
              return done(facultySaveErr);
            }

            // Get a list of Faculties
            agent.get('/api/faculties')
              .end(function (facultiesGetErr, facultiesGetRes) {
                // Handle Faculties save error
                if (facultiesGetErr) {
                  return done(facultiesGetErr);
                }

                // Get Faculties list
                var faculties = facultiesGetRes.body;

                // Set assertions
                (faculties[0].user._id).should.equal(userId);
                (faculties[0].name).should.match('Faculty name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Faculty if not logged in', function (done) {
    agent.post('/api/faculties')
      .send(faculty)
      .expect(403)
      .end(function (facultySaveErr, facultySaveRes) {
        // Call the assertion callback
        done(facultySaveErr);
      });
  });

  it('should not be able to save an Faculty if no name is provided', function (done) {
    // Invalidate name field
    faculty.name = '';

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

        // Save a new Faculty
        agent.post('/api/faculties')
          .send(faculty)
          .expect(400)
          .end(function (facultySaveErr, facultySaveRes) {
            // Set message assertion
            (facultySaveRes.body.message).should.match('Please fill Faculty name');

            // Handle Faculty save error
            done(facultySaveErr);
          });
      });
  });

  it('should be able to update an Faculty if signed in', function (done) {
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

        // Save a new Faculty
        agent.post('/api/faculties')
          .send(faculty)
          .expect(200)
          .end(function (facultySaveErr, facultySaveRes) {
            // Handle Faculty save error
            if (facultySaveErr) {
              return done(facultySaveErr);
            }

            // Update Faculty name
            faculty.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Faculty
            agent.put('/api/faculties/' + facultySaveRes.body._id)
              .send(faculty)
              .expect(200)
              .end(function (facultyUpdateErr, facultyUpdateRes) {
                // Handle Faculty update error
                if (facultyUpdateErr) {
                  return done(facultyUpdateErr);
                }

                // Set assertions
                (facultyUpdateRes.body._id).should.equal(facultySaveRes.body._id);
                (facultyUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Faculties if not signed in', function (done) {
    // Create new Faculty model instance
    var facultyObj = new Faculty(faculty);

    // Save the faculty
    facultyObj.save(function () {
      // Request Faculties
      request(app).get('/api/faculties')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Faculty if not signed in', function (done) {
    // Create new Faculty model instance
    var facultyObj = new Faculty(faculty);

    // Save the Faculty
    facultyObj.save(function () {
      request(app).get('/api/faculties/' + facultyObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', faculty.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Faculty with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/faculties/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Faculty is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Faculty which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Faculty
    request(app).get('/api/faculties/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Faculty with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Faculty if signed in', function (done) {
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

        // Save a new Faculty
        agent.post('/api/faculties')
          .send(faculty)
          .expect(200)
          .end(function (facultySaveErr, facultySaveRes) {
            // Handle Faculty save error
            if (facultySaveErr) {
              return done(facultySaveErr);
            }

            // Delete an existing Faculty
            agent.delete('/api/faculties/' + facultySaveRes.body._id)
              .send(faculty)
              .expect(200)
              .end(function (facultyDeleteErr, facultyDeleteRes) {
                // Handle faculty error error
                if (facultyDeleteErr) {
                  return done(facultyDeleteErr);
                }

                // Set assertions
                (facultyDeleteRes.body._id).should.equal(facultySaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Faculty if not signed in', function (done) {
    // Set Faculty user
    faculty.user = user;

    // Create new Faculty model instance
    var facultyObj = new Faculty(faculty);

    // Save the Faculty
    facultyObj.save(function () {
      // Try deleting Faculty
      request(app).delete('/api/faculties/' + facultyObj._id)
        .expect(403)
        .end(function (facultyDeleteErr, facultyDeleteRes) {
          // Set message assertion
          (facultyDeleteRes.body.message).should.match('User is not authorized');

          // Handle Faculty error error
          done(facultyDeleteErr);
        });

    });
  });

  it('should be able to get a single Faculty that has an orphaned user reference', function (done) {
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

          // Save a new Faculty
          agent.post('/api/faculties')
            .send(faculty)
            .expect(200)
            .end(function (facultySaveErr, facultySaveRes) {
              // Handle Faculty save error
              if (facultySaveErr) {
                return done(facultySaveErr);
              }

              // Set assertions on new Faculty
              (facultySaveRes.body.name).should.equal(faculty.name);
              should.exist(facultySaveRes.body.user);
              should.equal(facultySaveRes.body.user._id, orphanId);

              // force the Faculty to have an orphaned user reference
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

                    // Get the Faculty
                    agent.get('/api/faculties/' + facultySaveRes.body._id)
                      .expect(200)
                      .end(function (facultyInfoErr, facultyInfoRes) {
                        // Handle Faculty error
                        if (facultyInfoErr) {
                          return done(facultyInfoErr);
                        }

                        // Set assertions
                        (facultyInfoRes.body._id).should.equal(facultySaveRes.body._id);
                        (facultyInfoRes.body.name).should.equal(faculty.name);
                        should.equal(facultyInfoRes.body.user, undefined);

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
      Faculty.remove().exec(done);
    });
  });
});
