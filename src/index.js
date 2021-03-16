const express = require('express')

const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const morgan = require('morgan')
const compression = require('compression')

require('dotenv').config()

const apiRouter = require('./api')

const { info, error } = require('./logger')

const app = express()
const port = process.env.PORT || 5000

// Middlewares
app.use(cors())
app.use(helmet({ contentSecurityPolicy: false }))
app.use(morgan('tiny', { stream: { write: (msg) => info(msg.trimEnd()) } }))
app.use(compression())

// Rate Limiting
// 240 max request per minute
const apiRateLimiter = rateLimit({
    windowMs: 1000 * 60,
    max: 240,
})

const startServer = async () => {
    const { connect } = require('@dogehouse/client')

    try {
        const connection = await connect(
            process.env.DOGEHOUSE_TOKEN,
            process.env.DOGEHOUSE_REFRESH_TOKEN,
            {}
        )

        // API Router
        app.use('/v1', apiRateLimiter, apiRouter(connection))

        app.listen(port, () => {
            info(`Sending from port ${port}.`)
        })
    } catch (err) {
        error('Failed to connect')
    }
}

startServer()
