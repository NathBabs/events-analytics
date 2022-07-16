const express = require('express')
const {
    ingestController,
    fetchAllEventsController,
} = require('../controller/event.controller')
const validate = require('../middleware/validateRequest')
const eventSchema = require('../schema/event.schema')
const router = express.Router()

router.route('/analytics').post(validate(eventSchema), ingestController)

router.route('/analytics').get(fetchAllEventsController)

module.exports = router
