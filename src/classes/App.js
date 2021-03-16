const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const logger = require('morgan');
const Router = require('./Router');
const Logger = require('../util/Logger')
const { connect } = require('@dogehouse/client');
require('dotenv').config();

class App {
    constructor() {
        this.app = express();
        this.server = require('http').createServer(this.app);
        this.app.use(express.json());
        this.app.use(logger(':method :url :status :res[content-length] - :response-time ms'));

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
        const filePath = path.join(__dirname, '..', 'routes');
        const files = await fs.readdir(filePath);
        for await (const file of files) {
            if (file.endsWith('.js')) {
                const router = require(path.join(filePath, file));
                if (router.prototype instanceof Router) {
                    const instance = new router(this);
                    Logger.route(`Route File ${instance.path} running.`);
                    if(instance.auth) {
                        this.app.use(instance.path, this.Authentication, instance.createRoute());
                    } else {
                        this.app.use(instance.path, instance.createRoute());
                    }
                }
            }
        }

        const connection = await connect(
            process.env.DOGEHOUSE_TOKEN,
            process.env.DOGEHOUSE_REFRESH_TOKEN,{}
        );

        this.app.get('/v1/rooms', async (req, res) => {
            let rooms = await connection.fetch("all_rooms", { cursor: 0 });
            res.send(rooms)
        })

        this.app.get('/v1/popularRooms', async (req, res) => {
            let rooms = await connection.fetch("get_top_public_rooms", { cursor: 0 });
            res.send(rooms)
        })

        this.app.get('/v1', (req, res) => {
          res.json({ 
            name: 'DogeGarden API',
            version: 1,
            timestamp: new Date()
          })
        })
        
        this.app.get('/', (req, res) => {
           res.send(200)
        })

        this.app.use((req, res) => {
            res.send(404)
        });
    } // registerRoutes

    async listen(fn, https = false) {
        this.server.listen(process.env.PORT, fn);
    }
}

module.exports = App;
