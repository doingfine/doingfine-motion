'use strict';

var express = require('express');
var controller = require('./thread.controller');
var config = require('../../config/environment');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/all/:id', controller.showAllData);
router.get('/:id/creator/read/:read', controller.creatorMarkRead);
router.get('/:id/recipient/read/:read', controller.recipientMarkRead);

router.post('/find-thread', controller.findThread);
router.post('/', controller.create);

router.delete('/:id', controller.destroy);

module.exports = router;
