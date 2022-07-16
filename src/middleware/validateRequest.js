const { logger: log } = require('../utils/logger')
const validate = (schema) => async (req, res, next) => {
    try {
        await schema.validate({
            body: req.body,
            query: req.query,
            params: req.params,
        })

        return next()
    } catch (error) {
        log.error(error)
        return res.status(400).send(error.errors)
    }
}

module.exports = validate
