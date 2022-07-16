const { ingestEvents, getAllEvents } = require('../services/event.service')

exports.ingestController = async (req, res, next) => {
    const { body } = req
    ingestEvents({ body })
        .then((result) => {
            res.status(201).send(result)
        })
        .catch((error) => {
            next(error)
        })
}

exports.fetchAllEventsController = async (req, res, next) => {
    getAllEvents()
        .then((result) => {
            res.status(200).send(result)
        })
        .catch((error) => {
            next(error)
        })
}
