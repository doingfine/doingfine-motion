'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ThreadSchema = new Schema({
  participants: [{type: Schema.Types.ObjectId, ref: 'User'}],
  photos: [{type: Schema.Types.ObjectId, ref: 'Photo'}],
  creator: {type: Schema.Types.ObjectId},
  creatorRead: {type: Boolean, default: true},
  recipientRead: {type: Boolean, default: false},
  created_at : {type: Date, default: Date.now},
  updated_at : {type: Date}
});


ThreadSchema.pre('save', function(next){
  var now = new Date();
  this.updated_at = now;
  if ( ! this.created_at ){
    this.created_at = now;
  }
  next();
});



module.exports = mongoose.model('Thread', ThreadSchema);
