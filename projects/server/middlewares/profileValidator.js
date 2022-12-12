const Joi = require("joi")

const infoSchema = Joi.object({
    username: Joi.string().min(3),
    phone_number: Joi.string().min(5),
})

module.exports = { infoSchema }
