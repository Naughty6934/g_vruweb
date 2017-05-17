'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Booking = mongoose.model('Booking'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  booking;

/**
 * Booking routes tests
 */
describe('Booking CRUD tests', function () {

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

    // Save a user to the test db and create new Booking
    user.save(function () {
      booking = {
        name: 'Booking name'
      };

      done();
    });
  });

  it('should be able to save a Booking if logged in', function (done) {
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

        // Save a new Booking
        agent.post('/api/bookings')
          .send(booking)
          .expect(200)
          .end(function (bookingSaveErr, bookingSaveRes) {
            // Handle Booking save error
            if (bookingSaveErr) {
              return done(bookingSaveErr);
            }

            // Get a list of Bookings
            agent.get('/api/bookings')
              .end(function (bookingsGetErr, bookingsGetRes) {
                // Handle Bookings save error
                if (bookingsGetErr) {
                  return done(bookingsGetErr);
                }

                // Get Bookings list
                var bookings = bookingsGetRes.body;

                // Set assertions
                (bookings[0].user._id).should.equal(userId);
                (bookings[0].name).should.match('Booking name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Booking if not logged in', function (done) {
    agent.post('/api/bookings')
      .send(booking)
      .expect(403)
      .end(function (bookingSaveErr, bookingSaveRes) {
        // Call the assertion callback
        done(bookingSaveErr);
      });
  });

  it('should not be able to save an Booking if no name is provided', function (done) {
    // Invalidate name field
    booking.name = '';

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

        // Save a new Booking
        agent.post('/api/bookings')
          .send(booking)
          .expect(400)
          .end(function (bookingSaveErr, bookingSaveRes) {
            // Set message assertion
            (bookingSaveRes.body.message).should.match('Please fill Booking name');

            // Handle Booking save error
            done(bookingSaveErr);
          });
      });
  });

  it('should be able to update an Booking if signed in', function (done) {
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

        // Save a new Booking
        agent.post('/api/bookings')
          .send(booking)
          .expect(200)
          .end(function (bookingSaveErr, bookingSaveRes) {
            // Handle Booking save error
            if (bookingSaveErr) {
              return done(bookingSaveErr);
            }

            // Update Booking name
            booking.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Booking
            agent.put('/api/bookings/' + bookingSaveRes.body._id)
              .send(booking)
              .expect(200)
              .end(function (bookingUpdateErr, bookingUpdateRes) {
                // Handle Booking update error
                if (bookingUpdateErr) {
                  return done(bookingUpdateErr);
                }

                // Set assertions
                (bookingUpdateRes.body._id).should.equal(bookingSaveRes.body._id);
                (bookingUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Bookings if not signed in', function (done) {
    // Create new Booking model instance
    var bookingObj = new Booking(booking);

    // Save the booking
    bookingObj.save(function () {
      // Request Bookings
      request(app).get('/api/bookings')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Booking if not signed in', function (done) {
    // Create new Booking model instance
    var bookingObj = new Booking(booking);

    // Save the Booking
    bookingObj.save(function () {
      request(app).get('/api/bookings/' + bookingObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', booking.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Booking with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/bookings/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Booking is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Booking which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Booking
    request(app).get('/api/bookings/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Booking with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Booking if signed in', function (done) {
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

        // Save a new Booking
        agent.post('/api/bookings')
          .send(booking)
          .expect(200)
          .end(function (bookingSaveErr, bookingSaveRes) {
            // Handle Booking save error
            if (bookingSaveErr) {
              return done(bookingSaveErr);
            }

            // Delete an existing Booking
            agent.delete('/api/bookings/' + bookingSaveRes.body._id)
              .send(booking)
              .expect(200)
              .end(function (bookingDeleteErr, bookingDeleteRes) {
                // Handle booking error error
                if (bookingDeleteErr) {
                  return done(bookingDeleteErr);
                }

                // Set assertions
                (bookingDeleteRes.body._id).should.equal(bookingSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Booking if not signed in', function (done) {
    // Set Booking user
    booking.user = user;

    // Create new Booking model instance
    var bookingObj = new Booking(booking);

    // Save the Booking
    bookingObj.save(function () {
      // Try deleting Booking
      request(app).delete('/api/bookings/' + bookingObj._id)
        .expect(403)
        .end(function (bookingDeleteErr, bookingDeleteRes) {
          // Set message assertion
          (bookingDeleteRes.body.message).should.match('User is not authorized');

          // Handle Booking error error
          done(bookingDeleteErr);
        });

    });
  });

  it('should be able to get a single Booking that has an orphaned user reference', function (done) {
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

          // Save a new Booking
          agent.post('/api/bookings')
            .send(booking)
            .expect(200)
            .end(function (bookingSaveErr, bookingSaveRes) {
              // Handle Booking save error
              if (bookingSaveErr) {
                return done(bookingSaveErr);
              }

              // Set assertions on new Booking
              (bookingSaveRes.body.name).should.equal(booking.name);
              should.exist(bookingSaveRes.body.user);
              should.equal(bookingSaveRes.body.user._id, orphanId);

              // force the Booking to have an orphaned user reference
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

                    // Get the Booking
                    agent.get('/api/bookings/' + bookingSaveRes.body._id)
                      .expect(200)
                      .end(function (bookingInfoErr, bookingInfoRes) {
                        // Handle Booking error
                        if (bookingInfoErr) {
                          return done(bookingInfoErr);
                        }

                        // Set assertions
                        (bookingInfoRes.body._id).should.equal(bookingSaveRes.body._id);
                        (bookingInfoRes.body.name).should.equal(booking.name);
                        should.equal(bookingInfoRes.body.user, undefined);

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
      Booking.remove().exec(done);
    });
  });
});
