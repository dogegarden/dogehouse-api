const express = require('express')
const path = require('path')
const fs = require('fs').promises
const logger = require('morgan')
const Router = require('./Router')
const Logger = require('../util/Logger')
const compression = require('compression')
const rateLimit = require('express-rate-limit')
const cors = require('cors')
const helmet = require('helmet')
const { connect } = require('@dogehouse/client')
require('dotenv').config()

class App {
    constructor() {
        this.app = express()
        this.server = require('http').createServer(this.app)
        this.app.use(express.json())
        this.app.use(
            logger(
                ':method :url :status :res[content-length] - :response-time ms',
                { stream: { write: (msg) => Logger.API(msg.trimEnd()) } }
            )
        )

        this.debug = process.env.NODE_ENV !== 'production'

        this.app.use(cors())
        this.app.use(
            helmet({ contentSecurityPolicy: this.debug ? false : undefined })
        )
        this.app.use(compression())

        // API Rate Limiter
        this.apiRateLimiter = rateLimit({
            windowMs: 60 * 1000,
            max: 240,
        })

        this.port = process.env.PORT || 8000
        this.connection = null
    }
    /**
     *
     * @param {express.Request} req
     * @param {express.Response} res
     * @param {function()} next
     */
    /**
     *
     * @param {string} template
     * @param {express.Request} req
     * @param {express.Response} res
     * @param {{...}} data
     */

    async registerRoutes() {
        const filePath = path.join(__dirname, '..', 'routes')
        const files = await fs.readdir(filePath)
        for await (const file of files) {
            if (file.endsWith('.js')) {
                const router = require(path.join(filePath, file))
                if (router.prototype instanceof Router) {
                    const instance = new router(this)
                    Logger.route(`Route File ${instance.path} running.`)
                    if (instance.auth) {
                        this.app.use(
                            instance.path,
                            this.apiRateLimiter,
                            this.Authentication,
                            instance.createRoute()
                        )
                    } else {
                        this.app.use(
                            instance.path,
                            this.apiRateLimiter,
                            instance.createRoute()
                        )
                    }
                }
            }
        }

        this.app.get('/v1/rooms', this.apiRateLimiter, async (req, res) => {
            try {
                let rooms = await this.connection.fetch('all_rooms', {
                    cursor: 0,
                })
                res.status(200).json(rooms)
            } catch (err) {
                res.status(404).send(err)
            }
        })

        this.app.get(
            '/v1/popularRooms',
            this.apiRateLimiter,
            async (req, res) => {
                try {
                    let rooms = await this.connection.fetch(
                        'get_top_public_rooms',
                        { cursor: 0 }
                    )
                    res.status(200).json(rooms)
                } catch (err) {
                    res.status(404).send(err)
                }
            }
        )

        this.app.get('/v1', this.apiRateLimiter, (req, res) => {
            res.json({
                name: 'DogeGarden API',
                version: 1,
                timestamp: new Date(),
            })
        })

        this.app.use((req, res) => {
            res.sendStatus(404)
        })
    } // registerRoutes

    async listen(fn, https = false) {
        this.connection = await connect(
            process.env.DOGEHOUSE_TOKEN,
            process.env.DOGEHOUSE_REFRESH_TOKEN,
            {}
        )
        this.server.listen(this.port, fn)
    }
}

module.exports = App
