const { logger: log } = require('../utils/logger')
const validate = (schema) => async (req, res, next) => {
    const body = req.body
    try {
        await schema.isValid(body)

        return next()
    } catch (error) {
        log.error(error)
        return res.status(400).send(error.errors)
    }
}

module.exports = validate
