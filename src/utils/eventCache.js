const Event = require('../models/Events')
const NodeCache = require('node-cache')
const { logger: log } = require('./logger')
const eventCache = new NodeCache()

//  a function to retrieve the last inserted 'click' and 'pageView' events
// from the database and store them in a cache along with the timestamp
exports.getLastEvents = async () => {
    try {
        const clickEvent = Event.find({
            eventType: 'click', // find the last click event,
        })
            .sort({ id: -1 })
            .limit(1)

        const pageViewEvent = Event.find({
            eventType: 'pageView', // find the last pageView event,
        })
            .sort({ id: -1 })
            .limit(1)

        const [click, pageView] = await Promise.all([clickEvent, pageViewEvent])

        if (click) {
            eventCache.set('click', click[0].date)
            log.info(`Last click event set : ${click[0].date}`)
        }

        if (pageView) {
            eventCache.set('pageView', pageView[0].date)
            log.info(`Last pageView event set : ${pageView[0].date}`)
        }

        const response = {
            ...(click ? { click: click.date } : {}),
            ...(pageView ? { pageView: pageView.date } : {}),
        }

        return response
    } catch (error) {
        log.error(error)
        throw error
    }
}

exports.cacheInstance = function () {
    return eventCache
}
