const moment = require('moment')
const Event = require('../models/Events')
const CustomError = require('../utils/CustomError')
const { cacheInstance } = require('../utils/eventCache')
const { logger: log } = require('../utils/logger')

// function to find time difference between two timestamps in seconds with moment.js
function timeDiff(currentTimestamp, lastTimestamp) {
    const difference = moment(currentTimestamp).diff(lastTimestamp, 'seconds')
    return difference
}

exports.ingestEvents = async function ({ body }) {
    try {
        // get current timestamp utc
        const currentTimestamp = new Date().toISOString()

        // check if any click event and pageView event is present in the request body
        const foundClickEvent = body.find(
            (event) => event.eventType === 'click'
        )
        const foundPageViewEvent = body.find(
            (event) => event.eventType === 'pageView'
        )
        // check if click event is found in the request body
        // if it is found , get the last click event date from the cache and compare it with the current timestamp
        // if it is less than 3 seconds then delete all the click events from the request body
        if (foundClickEvent) {
            const lastClickEvent = cacheInstance().get('click')
            if (lastClickEvent) {
                const timeDifference = timeDiff(
                    currentTimestamp,
                    lastClickEvent
                )
                if (timeDifference < 3) {
                    body = body.filter((event) => event.eventType !== 'click')
                }
            }
        }

        // check if pageView event is found in the request body
        // if it is found , get the last pageView event date from the cache and compare it with the current timestamp
        // if it is less than 5 seconds then delete all the pageView events from the request body
        if (foundPageViewEvent) {
            const lastPageViewEvent = cacheInstance().get('pageView')
            if (lastPageViewEvent) {
                const timeDifference = timeDiff(
                    currentTimestamp,
                    lastPageViewEvent
                )
                if (timeDifference < 5) {
                    body = body.filter(
                        (event) => event.eventType !== 'pageView'
                    )
                }
            }
        }

        // check the length of the request body if it is greater than 0 then save the events in the database
        if (body.length === 0) {
            throw new CustomError(
                400,
                'All events are within their respective time limits'
            )
        }

        // get count of event documents in the database
        const count = await Event.countDocuments()
        // add an incremental number id to each event and timetamp
        // and save the events in the database
        const events = body.map((event, index) => {
            event.id = index + 1 + count
            event.date = currentTimestamp
            return event
        })

        const savedEvents = await Event.create(events)

        // set timestamp for click event in the cache if it was sfound in the request body
        if (foundClickEvent) {
            cacheInstance().set('click', currentTimestamp)
        }

        // set timestamp for pageView event in the cache if it was found in the request body
        if (foundPageViewEvent) {
            cacheInstance().set('pageView', currentTimestamp)
        }

        // return number of events saved in the database
        return {
            ingested: savedEvents.length,
        }
    } catch (error) {
        throw new CustomError(
            error.statusCode || 500,
            error.message || 'Something went wrong'
        )
    }
}

// function to get all events from the database
exports.getAllEvents = async function () {
    try {
        const events = await Event.find()
        return events
    } catch (error) {
        throw new CustomError(
            error.statusCode || 500,
            error.message || 'Something went wrong'
        )
    }
}
