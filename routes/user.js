const express = require('express')
// const router = express.Router()
const router = require('express-promise-router')()
const userController = require('../controllers/user')
const {validateParam, validateBody, schema} = require('../helpers/routerHelper')

router.route('/')
    .get(userController.index)
    .post(validateBody(schema.userSchema),userController.newUser)
    .delete()
router.route('/signin').post(validateBody(schema.authSignInSchema),userController.signIn)
router.route('/signup').post(validateBody(schema.authSignUpSchema),userController.signUp)
router.route('/secret').get(userController.secret)


router.route('/:userId')
    .get(validateParam(schema.idSchema, 'userId'),userController.getUser)
    .put(validateBody(schema.userSchema), userController.replaceUser)
    .patch(validateBody(schema.updateUserSchema),userController.updateUser)

router.route('/:userId/decks')
    .get(validateParam(schema.idSchema, 'userId'),userController.getDecksByUser)
    .post(validateBody(schema.deckSchema),userController.newDeck)
module.exports = router;
