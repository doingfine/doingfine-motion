'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/threads/:id', controller.showAllThreadsData);

router.post('/find', controller.find);
router.post('/confirm', controller.confirm);
router.post('/', controller.create);

router.delete('/:id', controller.destroy);

// Currently not using authentication. Uncomment these routes to use.
// router.get('/me', auth.isAuthenticated(), controller.me);
// router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);

module.exports = router;
