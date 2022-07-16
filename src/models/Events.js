// create mongoose schema for user events
const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    eventType: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
})

const Event = mongoose.model('Event', eventSchema)

module.exports = Event
