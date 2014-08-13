'use strict';

var Thread = require('./thread.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var Photo = require('../photo/photo.model');
var User = require('../user/user.model');
var Q = require('q');
/** Twilio Setup **/
if(config.env === 'development') { 
  var TWILIO_CREDS = require('../../config/local.env.js');
 };
var accountSid =  process.env.TWILIO_SID || TWILIO_CREDS.TWILIO_SID;
var authToken = process.env.TWILIO_TOKEN || TWILIO_CREDS.TWILIO_TOKEN;
var client = require('twilio')(accountSid, authToken);

var validationError = function(res, err) {
  return res.json(422, err);
};

/**
 * Get list of all threads
 */
exports.index = function(req, res) {
  Thread.find({}, function (err, threads) {
    if(err) return res.send(500, err);
    res.json(200, threads);
  });
};

/**
 * Send an SMS text to the specified phone number.
 */
exports.sendSms = function(name, phoneNumber, message){
  var defaultMessage = " says: let's trade faces! http://tradingfaces.herokuapp.com";
  message = message || defaultMessage;
  client.messages.create({
    body: name + message,
    to: "+1" + phoneNumber,
    from: "+16467592566"
  }, function(err, responseData){
      if(err){
        console.log(err);
      }else{
        console.log(responseData.to); 
        console.log(responseData.body); 
      }
    });
};

/**
 * Loops through an array of users phone numbers.
 * Replaces a user's phone number with his/her ObjectId if user is registered,
 * otherwise it creates a user object and replaces the user's phone number with
 * the newly created ObjectId
 *
 * Input: an array of participants phone numbers
 * Output: an array of participants user ids
 */
var sendSmsTo = [];
var preCreate = function(participants){
  // set promiseArray to []
  var promiseArray = [];
  var fromPhoneNumber = participants[0];
  // loop participants in array
  participants.forEach(function(participant){
    // create an empty promise
    var deferred = Q.defer();
    // lookup phone number
    User.findOne({"phone": participant}, function(err, user){
      //bubble up errors
      if (err) {
        deferred.reject(err);
      }
      // if user exists resolve promise with user id
      if (user) {
        deferred.resolve(user);
      }
      // else create new user object
      else {
        var newUser = new User({
          "first": "Pending",
          "last": "Pending",
          "phone": participant,
          "status": "pending"
        });
        // save new user object
        newUser.save(function(err, user){
          // bubble up errors
          if(err) deferred.reject(err);
          // send text to new user with twilio
          sendSmsTo.push(participant);
          // resolve promise with new user id
          deferred.resolve(user);
        });
      }
    })
    // add promise to promiseArray
    promiseArray.push(deferred.promise);
  })
  // return promise array
  return promiseArray;
};

/**
 * Creates a new thread
 * Expects the following parameters:
 * req.body.participants -> Expect >= 2 participants -> ex: [ObjectId, ObjectId]
 * req.body.url -> Photo url -> ex: String
 * req.body.owner -> Photo owner id -> ex: String
 */
exports.create = function (req, res, next) {
  var creatorOfThread = req.body.participants[0];
  var promises = preCreate(req.body.participants);
  Q.all(promises).then(function(result){

    // send notification to unregistered users to play a game
    User.findOne({ "phone": creatorOfThread }, function(err, user){
      if(err) console.log(err);
      var firstName = user.first;
      sendSmsTo.forEach(function(phoneNumber){
        exports.sendSms(firstName, phoneNumber);
      });
    });

    // create thread
    var userParticipants = result;
    var newThread = new Thread({participants: userParticipants, creator: userParticipants[0].id});
    newThread.save(function(err, thread) {
      if (err) return validationError(res, err);
      // Add thread to each participants thread array.
      // We return the thread, so do not need to wait for users to save.
      userParticipants.forEach(function(participant){
        participant.threads.push(thread.id);
        participant.save();
      });
      res.json({ data: thread });
    });
  }, function(err){
    console.log(err);
    // Letting client know of an error, might want to send back more detail
    res.status(500).send(err);
  });
};

// Expects same parameters as + a threadID.
// Not used here.  Using photo.create in photo api
exports.addPhoto = function(req, res) {
  var newPhoto = new Photo({url: req.body.url, owner: req.body.owner});
  newPhoto.save(function(err, photo) {
    Thread.findById(req.body.threadId, function(err, thread) {
      if (err) return validationError(res, err);
      thread.photos.push(photo.id);
      thread.save(function(err, updatedThread) {
        if (err) return validationError(res, err);
        res.json({ data: photo });
      });
    });
  });
};

/**
 * Get a single thread
 */
exports.show = function (req, res, next) {
  var threadId = req.params.id;

  Thread.findById(threadId, function (err, thread) {
    if (err) return next(err);
    if (!thread) return res.send(401);
    res.json(thread);
  });
};

/**
 * Get a single thread and populate all participant and photo fields with JSON data.
 */
exports.showAllData = function (req, res, next) {
  var options = [{
    path: 'participants', model: 'User'}, {
    path: 'photos', model: 'Photo'
  }];
  Thread.findById(req.params.id).populate(options).exec(function (err, threadData) {
    if (err) return next(err);
    if (!threadData) return res.send(401);
    res.json(threadData);
  });
};

/**
 * Search for a thread based on request containing array of participant IDs.
 */
exports.findThread = function (req, res, next) {
  Thread.findOne({participants: {$all: req.body.participants}}).exec(function (err, threadData) {
    if (err) return err;
    if (!threadData) return res.send(null);
    res.json(threadData);
  });
};

/**
 * Flips the read flag for the creator on the thread.
 */
exports.creatorMarkRead = function (req, res, next) {
  var threadId = req.params.id;
  var read = req.params.read;
  Thread.update({_id: threadId}, { $set: { creatorRead: read }}, function(err){
    console.log(err)
  });
};

/**
 * Flips the read flag for the recipient on the thread.
 */
exports.recipientMarkRead = function (req, res, next) {
  var threadId = req.params.id;
  var read = req.params.read;
  Thread.update({_id: threadId}, { $set: { recipientRead: read }}, function(err){
    console.log(err)
  });
};

/**
 * Deletes a thread
 */
exports.destroy = function(req, res) {
  Thread.findByIdAndRemove(req.params.id, function(err, thread) {
    if(err) return res.send(500, err);
    return res.send(204);
  });
};



