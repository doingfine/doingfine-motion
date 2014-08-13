/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
var Photo = require('../api/photo/photo.model');

// Re-seeds the database with below data everytime server initializes. Uncomment to use.
// User.find({}).remove(function() {
//   User.create([{
//     first: 'Dave',
//     last: 'GW',
//     email: 'david@gmail.com',
//     uuid:'23sf23r',
//     phone: 5105550000
//   }, {
//     first: 'Nelson',
//     last: 'Riley',
//     email: 'nelson@gmail.com',
//     uuid:'3453j43534',
//     phone: 5107779911
//   }], function(err, user) {
//       Photo.find({}).remove(function() {
//         Photo.create({
//           owner: user.id,
//           url: 'http://www.michigandaily.com/files/imagecache/fullnode/justified.jpg'
//         }, function(err, photo) {
//           console.log(err);
//           console.log('finished populating photos');
//           user.photos.push(photo.id);
//           user.save();
//         });
//       });
//       console.log(err);
//       console.log('finished populating users');
//     }
//   );
// });


