const yup = require('yup')

const eventSchema = yup.object().noUnknown(true).shape({
    eventType: yup.string().required(),
    user: yup.number().required().positive().integer().required(),
})

const ArrayofEvents = yup
    .array()
    .of(eventSchema)
    .test('is-array-of-events', 'must be an array of events', (value) => {
        // check if each object in the array is valid
        return value.every((event) =>
            eventSchema.isValidSync(event, { strict: true })
        )
    })

module.exports = ArrayofEvents
