const Joi = require('joi')

const validateParam = (schema, name) => {
    return (req, res, next) => {
        const validateResult = schema.validate({param: req.params[name]})
        if(validateResult.error){
            return res.status(400).json(validateResult.error)
        }else{
            if(!req.value)req.value = {}
            if(!req.value.params) req.value.params = {}
            req.value.params[name] = req.params[name]
            next()
        }
    }
}

const validateBody = (schema) => {
    return (req,res,next) => {
        const validateResult = schema.validate(req.body)
        console.log("validateResult ", validateResult)
        if(validateResult.error){
            return res.status(400).json(validateResult.error)
        }else{
            if(!req.value) req.value = {}
            req.value.body = validateResult.value
            next()
        }
    }
}

const schema = {
    authSignUpSchema: Joi.object({
        firstName: Joi.string().min(2).required(),
        lastName: Joi.string().min(2).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    }),
    authSignInSchema: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    }),
    idSchema: Joi.object({
        param: Joi.string().regex(/^\w{24}$/).required()
    }),
    userSchema: Joi.object({
        firstName: Joi.string().min(2).required(),
        lastName: Joi.string().min(2).required(),
        email: Joi.string().email().required(),
    }),
    deckSchema: Joi.object({
        name: Joi.string().min(2).required(),
        descriptions: Joi.string().min(10).required(),
        owner: Joi.string().regex(/^\w{24}$/).required()
    }),
    updateDeckSchema: Joi.object({
        name: Joi.string().min(2),
        descriptions: Joi.string().min(10),
        owner: Joi.string().regex(/^\w{24}$/)
    }),
    updateUserSchema: Joi.object({
        firstName: Joi.string().min(2),
        lastName: Joi.string().min(2),
        email: Joi.string().email(),
    }),
}

module.exports = {
    validateBody,
    validateParam,
    schema
}
