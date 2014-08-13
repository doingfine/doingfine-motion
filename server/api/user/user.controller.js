'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var sendSms = require('../thread/thread.controller').sendSms;

var validationError = function(res, err) {
  return res.json(422, err);
};

exports.confirm = function (req, res) {
  console.log(req.body);
  var userId = req.body.id;
  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(401);
    if(user.confirmCode === req.body.code) {
      user.status = 'confirmed';
      user.save(function(err, user){
        if(err) console.log(err);
        res.json(200, user);
      });
    }else {
      res.status(401).send("Wrong Code Dude!");
    }
  });
};

/**
 * Get list of users
 */
exports.index = function(req, res) {
  User.find({}, function (err, users) {
    if(err) return res.send(500, err);
    res.json(200, users);
  });
};

exports.genConfirmCode = function () {
  var code;
  code = Math.floor(Math.random() * 9000) + 1000;
  return code;
};
/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  var message;
  newUser.confirmCode = exports.genConfirmCode();
  newUser.save(function(err, user) {
    if (err) return validationError(res, err);
    console.log('new user is ', user);
    message = " please confirm your Trading Faces account. Your code is: " + newUser.confirmCode;
    sendSms(newUser.first, user.phone, message);
    res.json(user);
  });
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;
  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(401);
    res.json(user);
  });
};

/**
 * Find a single user
 */
exports.find = function (req, res, next) {
  console.log(req.body);
  User.findOne(req.body, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(null);
    res.json(user);
  });
};

/**
 * Get a single user's threads
 * Populates the user, thread and photo with JSON data.
 */
exports.showAllThreadsData = function (req, res, next) {
  var userId = req.params.id;
  User.findById(userId)
    .populate('threads')
    .exec(function (err, userThreads) {
      if (err) return err;
      if (!userThreads) return res.send(401);
      var options = [{
        path: 'threads.participants', model: 'User'}, {
        path: 'threads.photos', model: 'Photo'
      }];
      User.populate(userThreads, options, function (err, userThreadsPhotos) {
        if (err) return err;
        res.json(userThreadsPhotos);
      });
    });
};

/**
 * Deletes a user
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.send(500, err);
    return res.send(204);
  });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.json(401);
    res.json(user);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
