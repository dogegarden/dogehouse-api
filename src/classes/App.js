const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const logger = require('morgan');
const Router = require('./Router');
const Logger = require('../util/Logger')
const { raw: { connect }, wrap } = require('dogehouse-js');
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
            return res.redirect('/v1/popularRooms')
        });

        this.app.get('/v1/popularRooms', async (req, res) => {
            try {
                let rooms = await connection.fetch("get_top_public_rooms", { cursor: 0 });
                return res.send(rooms)
            } catch(err) {
                return(res.send({"Error": err}))
            }
        });

        this.app.get('/v1/scheduledRooms', async (req, res) => {
            try {
                let scheduled_rooms = await connection.fetch("get_scheduled_rooms", { cursor: "", getOnlyMyScheduledRooms: false })
                return res.send(scheduled_rooms)
            } catch(err) {
                return(res.send({"Error": err}))
            }
        });

        this.app.get('/v1/statistics', async (req, res) => {
            try {
                let rooms = await connection.fetch("get_top_public_rooms", { cursor: 0 });
                let scheduledRooms = await connection.fetch("get_scheduled_rooms", { cursor: "", getOnlyMyScheduledRooms: false })

                return res.send({
                    "totalRooms": rooms.rooms.length,
                    "totalScheduledRooms": scheduledRooms.scheduledRooms.length,
                    "totalOnline": rooms.rooms.map(it => it.numPeopleInside).reduce((a, b) => a + b, 0),
                    timestamp: new Date()
                })
            } catch (err) {
                return(res.send({"Error": err}))
            }
        });

        this.app.get('/v1', (req, res) => {
          return res.json({ 
            name: 'DogeGarden API',
            version: 1.1,
            timestamp: new Date()
          })
        });
        
        this.app.get('/', (req, res) => {
           return res.sendStatus(200)
        });

        this.app.use((req, res) => {
            return res.sendStatus(404)
        });
    }

    async listen(fn, https = false) {
        if (!process.env.PORT) return Logger.error('Please add PORT= to your .env')
        this.server.listen(process.env.PORT, fn);
    }
}

module.exports = App;
