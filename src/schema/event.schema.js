const yup = require('yup')

const eventSchema = yup.object().shape({
    eventType: yup.string().required(),
    user: yup.number().required().positive().integer().required(),
})

const ArrayofEvents = yup.object({
    body: yup.array().of(eventSchema).required(),
})

module.exports = ArrayofEvents
