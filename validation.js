const Joi = require('@hapi/joi')

//Register Validation
const registerValidation = (data, mainSchema) => {
    const schema = {
        name: Joi.string().min(3).required(),
        password: Joi.string().min(6).required()
    }
    return mainSchema.validate(data)
}

const loginValidation = (data, mainSchema) => {
    const schema = {
        name: Joi.string().min(3).required(),
        password: Joi.string().min(6).required()
    }
    return mainSchema.validate(data)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation