const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')

router.route('/')
    .get(userController.index)
    .post()
    .patch()
    .delete()

module.exports = router;
