'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Authority = mongoose.model('Authority'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  authority;

/**
 * Authority routes tests
 */
describe('Authority CRUD tests', function () {

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

    // Save a user to the test db and create new Authority
    user.save(function () {
      authority = {
        name: 'Authority name'
      };

      done();
    });
  });

  it('should be able to save a Authority if logged in', function (done) {
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

        // Save a new Authority
        agent.post('/api/authorities')
          .send(authority)
          .expect(200)
          .end(function (authoritySaveErr, authoritySaveRes) {
            // Handle Authority save error
            if (authoritySaveErr) {
              return done(authoritySaveErr);
            }

            // Get a list of Authorities
            agent.get('/api/authorities')
              .end(function (authoritiesGetErr, authoritiesGetRes) {
                // Handle Authorities save error
                if (authoritiesGetErr) {
                  return done(authoritiesGetErr);
                }

                // Get Authorities list
                var authorities = authoritiesGetRes.body;

                // Set assertions
                (authorities[0].user._id).should.equal(userId);
                (authorities[0].name).should.match('Authority name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Authority if not logged in', function (done) {
    agent.post('/api/authorities')
      .send(authority)
      .expect(403)
      .end(function (authoritySaveErr, authoritySaveRes) {
        // Call the assertion callback
        done(authoritySaveErr);
      });
  });

  it('should not be able to save an Authority if no name is provided', function (done) {
    // Invalidate name field
    authority.name = '';

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

        // Save a new Authority
        agent.post('/api/authorities')
          .send(authority)
          .expect(400)
          .end(function (authoritySaveErr, authoritySaveRes) {
            // Set message assertion
            (authoritySaveRes.body.message).should.match('Please fill Authority name');

            // Handle Authority save error
            done(authoritySaveErr);
          });
      });
  });

  it('should be able to update an Authority if signed in', function (done) {
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

        // Save a new Authority
        agent.post('/api/authorities')
          .send(authority)
          .expect(200)
          .end(function (authoritySaveErr, authoritySaveRes) {
            // Handle Authority save error
            if (authoritySaveErr) {
              return done(authoritySaveErr);
            }

            // Update Authority name
            authority.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Authority
            agent.put('/api/authorities/' + authoritySaveRes.body._id)
              .send(authority)
              .expect(200)
              .end(function (authorityUpdateErr, authorityUpdateRes) {
                // Handle Authority update error
                if (authorityUpdateErr) {
                  return done(authorityUpdateErr);
                }

                // Set assertions
                (authorityUpdateRes.body._id).should.equal(authoritySaveRes.body._id);
                (authorityUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Authorities if not signed in', function (done) {
    // Create new Authority model instance
    var authorityObj = new Authority(authority);

    // Save the authority
    authorityObj.save(function () {
      // Request Authorities
      request(app).get('/api/authorities')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Authority if not signed in', function (done) {
    // Create new Authority model instance
    var authorityObj = new Authority(authority);

    // Save the Authority
    authorityObj.save(function () {
      request(app).get('/api/authorities/' + authorityObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', authority.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Authority with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/authorities/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Authority is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Authority which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Authority
    request(app).get('/api/authorities/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Authority with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Authority if signed in', function (done) {
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

        // Save a new Authority
        agent.post('/api/authorities')
          .send(authority)
          .expect(200)
          .end(function (authoritySaveErr, authoritySaveRes) {
            // Handle Authority save error
            if (authoritySaveErr) {
              return done(authoritySaveErr);
            }

            // Delete an existing Authority
            agent.delete('/api/authorities/' + authoritySaveRes.body._id)
              .send(authority)
              .expect(200)
              .end(function (authorityDeleteErr, authorityDeleteRes) {
                // Handle authority error error
                if (authorityDeleteErr) {
                  return done(authorityDeleteErr);
                }

                // Set assertions
                (authorityDeleteRes.body._id).should.equal(authoritySaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Authority if not signed in', function (done) {
    // Set Authority user
    authority.user = user;

    // Create new Authority model instance
    var authorityObj = new Authority(authority);

    // Save the Authority
    authorityObj.save(function () {
      // Try deleting Authority
      request(app).delete('/api/authorities/' + authorityObj._id)
        .expect(403)
        .end(function (authorityDeleteErr, authorityDeleteRes) {
          // Set message assertion
          (authorityDeleteRes.body.message).should.match('User is not authorized');

          // Handle Authority error error
          done(authorityDeleteErr);
        });

    });
  });

  it('should be able to get a single Authority that has an orphaned user reference', function (done) {
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

          // Save a new Authority
          agent.post('/api/authorities')
            .send(authority)
            .expect(200)
            .end(function (authoritySaveErr, authoritySaveRes) {
              // Handle Authority save error
              if (authoritySaveErr) {
                return done(authoritySaveErr);
              }

              // Set assertions on new Authority
              (authoritySaveRes.body.name).should.equal(authority.name);
              should.exist(authoritySaveRes.body.user);
              should.equal(authoritySaveRes.body.user._id, orphanId);

              // force the Authority to have an orphaned user reference
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

                    // Get the Authority
                    agent.get('/api/authorities/' + authoritySaveRes.body._id)
                      .expect(200)
                      .end(function (authorityInfoErr, authorityInfoRes) {
                        // Handle Authority error
                        if (authorityInfoErr) {
                          return done(authorityInfoErr);
                        }

                        // Set assertions
                        (authorityInfoRes.body._id).should.equal(authoritySaveRes.body._id);
                        (authorityInfoRes.body.name).should.equal(authority.name);
                        should.equal(authorityInfoRes.body.user, undefined);

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
      Authority.remove().exec(done);
    });
  });
});
