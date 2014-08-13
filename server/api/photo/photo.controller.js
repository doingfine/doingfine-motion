'use strict';

var Photo = require('./photo.model');
var User = require('../user/user.model');
var Thread = require('../thread/thread.model');
var passport = require('passport');
var config = require('../../config/environment');
var Busboy = require('busboy');
var path = require('path');   
var fs = require('fs');
var AWS = require('aws-sdk');
var inspect = require('util').inspect;

if(config.env === 'development') { 
  var AWS_CREDS = require('../../config/local.env.js');
 };

var validationError = function(res, err) {
  return res.json(422, err);
};

/**
 * Get list of all photos
 */
exports.index = function(req, res) {
  Photo.find({}, function (err, photos) {
    if(err) return res.send(500, err);
    res.json(200, photos);
  });
};

/**
 * Creates a new photo, expects ownerId, picture, threadID
 */
exports.create = function (req, res, next) {
  var fstream;
  var photoData = {};
  console.log('trying to create new portfolio');

  /*  
    Busboy only reads multipart form requests. This statement re-routes JSON requests
    so photos can be added when testing in the browser. Statment will be bypassed 
    in mobile as native camera photos are sent in multipart format.
  */
  if (req.headers['content-type'] === 'application/json;charset=UTF-8'){
    var newPhoto = new Photo({url: req.body.url, owner: req.body.owner});
    newPhoto.save(function(err, photo) {
      Thread.findById(req.body.threadId, function(err, thread) {
        if (err) return validationError(res, err);
        thread.photos.push(photo.id);
        thread.save(function(err, updatedThread) {
          if (err) return validationError(res, err);
          res.json(photo);
        });
      });
    });
  }

  // Mobile app will send multipart form request and use this statement.
  else {
    console.log('in form data');
    var busboy = new Busboy({ headers: req.headers });
    //initiate form processing
    req.pipe(busboy);
    //busboy parses out the multipart/form data
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
      //save file
      console.log('HEY ' + config.root +'/tmp/');
      fstream = fs.createWriteStream(config.root + '/tmp/' + filename);
      file.pipe(fstream);
      fstream.on('close', function () {    
        console.log("Saving Finished of " + filename);              
      });
      file.on('data', function(data) {
        console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
      });
      file.on('end', function(data) {
        //add data to the storage object above
        console.log('DATA from end up file upload', data);
        photoData[fieldname]=filename;
        console.log('File [' + fieldname + '] Finished');
      });
    });
    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
      //add owner userId to the storage object above
      photoData[fieldname]=val;
      console.log('Field [' + fieldname + ']: value: ' + inspect(val));
    });
    busboy.on('finish', function() {
      console.log('Done parsing form!');
      console.log('photo data', photoData);

      //check to see we have the required photo model data from the post
      if (photoData.owner && photoData.photo && photoData.threadId){

        var newPhoto = new Photo(photoData);
        //create the new photo object
        newPhoto.save(function(err, photo) {
          if (err) res.send(validationError(res, err));
          //hard code for now
          photo.url='http://s3-us-west-1.amazonaws.com/tradingfaces/'+photo.id+'.jpg';
          photo.cloudStatus = 'in process';
          photo.name= photo.id;
          //set the photo name to the photo object id
          photo.save(function(err, photo) {
            if (err) return validationError(res, err);
            uploadToCloud(photo, photoData.photo, photo.id);
            res.json(photo);
          });
          //add this photo to the thread
          Thread.findById(photoData.threadId, function(err, thread) {
            if (err) return validationError(res, err);
            thread.photos.push(photo.id);
            thread.save(function(err, updatedThread) {
            if (err) return validationError(res, err);
            console.log('photo added to thread', updatedThread.id);
            });
          });
          //add this photo to user collection
          User.findById(photoData.owner, function (err, user) {
            if (err) return err;
            user.photos.push(photo.id);
            user.save(function(err, photo) {
              if (err) return err;
              console.log('Added photo '+ photo.id + ' to user '+ photoData.owner);
            });
          });
        });
      } else {
        res.send('we need a valid userId for the owner and photo data');
      }
    });
  }
};

/**
 * Upload temp file to S3 / delete temp
 */

var uploadToCloud = function (photo, photoName, photoId) {

  console.log('upload to cloud got photo id of ' +  photoId + 'and name '+ photoName);

  var accessKeyId =  process.env.AWS_KEY || AWS_CREDS.AWS_KEY;
  var secretAccessKey = process.env.AWS_SECRET || AWS_CREDS.AWS_SECRET;

  AWS.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey
  });

  //Grab the photo from temp storage in the server
  fs.readFile(config.root + '/tmp/'+ photoName, function (err, data) {

    var params = {
        Bucket: 'tradingfaces',
        Key: photoId+'.jpg',
        Body: data
      };

    var s3 = new AWS.S3();
    //Send photo to s3
    s3.putObject(params, function (perr, pres) {
      if (perr) {
          console.log("Error uploading data: ", perr);
          photo.cloudStatus = 'error';
          photo.save(function(err, photo) {
            if (err) return validationError(res, err);
            console.log('Cloud status ERROR for photo ', photo.id);
          });
          return perr;
      } else {
        console.log('resp from amazon', pres);
        console.log("Successfully uploaded " +photoName +" to s3 bucket");
        photo.cloudStatus = 'confirmed';
        photo.save(function(err, photo) {
          if (err) return validationError(res, err);
          console.log('SAVED PHOTO DATA ', photo);
          console.log('Cloud status updated for photo ', photo.id);
        });
        deleteTempFile(photoName);
        return pres;
      }
    });
  });
};

/**
 * Delete TempFile
 */
var deleteTempFile = function (photoName) {
  fs.unlink(config.root +'/tmp/'+ photoName, function (err) {
    if (err) throw err;
    console.log('successfully deleted ./tempImages/'+ photoName);
  });
};


/**
 * Get a single photo
 */
exports.show = function (req, res, next) {
  var photoId = req.params.id;

  Photo.findById(photoId, function (err, photo) {
    if (err) return next(err);
    if (!photo) return res.send(401);
    res.json(photo.profile);
  });
};

/**
 * Deletes a photo
 */
exports.destroy = function(req, res) {
  Photo.findByIdAndRemove(req.params.id, function(err, photo) {
    if(err) return res.send(500, err);
    return res.send(204);
  });
};



