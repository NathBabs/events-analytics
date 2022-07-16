const { pino } = require('pino')
const dayjs = require('dayjs')

exports.logger = pino({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
        },
    },
    base: {
        pid: false,
    },
    timestamp: () => `, "time":"${dayjs().format()}`,
})
