'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var authTypes = ['github', 'twitter', 'facebook', 'google'];

var UserSchema = new Schema({
  phone: { type: Number, required: true},
  first: {type: String},
  last: {type: String},
  email: { type: String},
  status: { type: String, required: true},
  uuid: {type: String, default: ''},
  picture: {type: String, default: ''}, //S3 url
  created_at : {type: Date, default: Date.now},
  updated_at : {type: Date},
  threads: [{type: Schema.Types.ObjectId, ref: 'Thread'}],
  photos: [{type: Schema.Types.ObjectId, ref: 'Photo'}],
  confirmCode: { type: Number }
});


UserSchema.pre('save', function(next){
  var now = new Date();
  this.updated_at = now;
  if ( ! this.created_at ){
    this.created_at = now;
  }
  next();
});

module.exports = mongoose.model('User', UserSchema);
