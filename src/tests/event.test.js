const NodeCache = require('node-cache')
const eventCache = new NodeCache()
const moment = require('moment')
const sinon = require('sinon')
const chai = require('chai')
const supertest = require('supertest')
const app = require('../app')
const expect = chai.expect
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const Event = require('../models/Events')
const { eventsData, databaseData } = require('./event.data')

const request = supertest(app)

chai.should()

describe('Event Analytics', () => {
    let findEvents
    let createEvent
    let timestamp
    let getEvent
    let countEvents
    let setEvent
    beforeEach(() => {
        // stub get and set methods of the eventCache
        getEvent = sinon.stub(eventCache, 'get')
        setEvent = sinon.stub(eventCache, 'set')
        // set timestamp to 6 seconds ago
        timestamp = moment().subtract(6, 'seconds').toISOString()
        // set the timestamp of the last click event to the timestamp
        getEvent.withArgs('click').returns(timestamp)
        // set the timestamp of the last pageView event to the timestamp
        getEvent.withArgs('pageView').returns(timestamp)
        findEvents = sinon.stub(Event, 'find')
        createEvent = sinon.stub(Event, 'create')
        countEvents = sinon.stub(Event, 'countDocuments')

        // stub the findEvents method to return the database data
        findEvents.returns(databaseData)
        // stub the createEvent method to return the database data
        createEvent.returns(databaseData)
        // stub the countEvents method to return the database data
        countEvents.returns(3)
    })

    afterEach(() => {
        // restore the stubbed methods
        getEvent.restore()
        setEvent.restore()
        findEvents.restore()
        createEvent.restore()
        countEvents.restore()
    })

    it(' should create events', async () => {
        const response = await request.post('/analytics').send(eventsData)
        expect(response.status).to.equal(201)
        expect(response.body).to.deep.equal({
            ingested: 3,
        })
    })

    it('should return a collection of events', async () => {
        const response = await request.get('/analytics')
        expect(response.status).to.equal(200)
        expect(response.body).to.deep.equal(databaseData)
    })
})
