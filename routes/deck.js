const router = require('express-promise-router')()
const deckController = require('../controllers/deck')
const {validateParam, validateBody, schema} = require('../helpers/routerHelper')

router.route('/')
    .get(deckController.index)
    .post(validateBody(schema.deckSchema),deckController.newDeck)
router.route('/:deckId')
    .get(validateParam(schema.idSchema, 'deckId'), deckController.getDeck)
    .put(validateBody(schema.deckSchema), deckController.replaceDeck)
    .patch(validateBody(schema.updateDeckSchema),deckController.updateDeck)
    .delete(validateParam(schema.idSchema, 'deckId'), deckController.deleteDeck)
module.exports = router
