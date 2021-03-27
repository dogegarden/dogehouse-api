// testing git actions.
const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const logger = require('morgan');
const Router = require('./Router');
const Logger = require('../util/Logger')
const { raw: { connect }, wrap } = require('dogehouse-js');
const Calls = require('../database/functions')
require('dotenv').config();

class App {
    constructor() {
        this.app = express();
        this.server = require('http').createServer(this.app);
        this.app.use(express.json());
        this.app.use(logger(':remote-addr >> :method :url :status :res[content-length] - :response-time ms'));
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

        const server2 = require('http').createServer();
        const io = require('socket.io')(server2, { transports: ['websocket'], serveClient: false, path: '/socket' });

        server2.listen(7080);

        io.on('connection', (socket) => {
            Logger.info('Socket Client Connected', io.sockets.sockets.size)

            socket.on('disconnect', (data) => {
                Calls.deleteBot(socket.id)
                Logger.info('Socket Client Disconnected', io.sockets.sockets.size)
            });

            socket.on('init', async function () {
                Logger.info('Socket Client Init', io.sockets.sockets.size,)
            })
            
            socket.on('transmit', async function (received) { //received data.
                let new_data = {
                    socket_id: socket.id,
                    bot: { uuid: received.bot.uuid, username: received.bot.username || 'A Default Doge', avatar: received.bot.avatarURL  || 'https://cdn.discordapp.com/attachments/824724836936187974/824936185734234132/orangeDiscordIcon.png'},
                    room: { uuid: received.room.uuid, name: received.room.name || 'No Room', listening: received.room.listening || 'No Room', users: received.room.users || 'No Users' }

                }
                await Calls.transmitBot(socket.id, new_data)
                Logger.info('Socket Client Transmit', socket.id)

            });

            socket.on('error', (err) => {
                Logger.error('Socket Error', socket.id, err)
            });
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
                let bots_length = await Calls.getAllBotsLength()
                let rooms = await connection.fetch("get_top_public_rooms", { cursor: 0 });
                let scheduledRooms = await connection.fetch("get_scheduled_rooms", { cursor: "", getOnlyMyScheduledRooms: false })

                return res.send({
                    totalRooms: rooms.rooms.length,
                    totalScheduledRooms: scheduledRooms.scheduledRooms.length,
                    totalOnline: rooms.rooms.map(it => it.numPeopleInside).reduce((a, b) => a + b, 0),
                    totalBotsOnline: io.sockets.sockets.size,
                    totalBotsSendingTelemetry: bots_length
                })
            } catch (err) {
                return(res.send({"Error": err}))
            }
        });

        this.app.get('/v1/bots', async (req, res) => {
            try {
                let bots = await Calls.getAllBots()
                let total = {
                    bots: bots
                }
                return res.send(total)
            } catch(err) {
                return(res.send({"Error": err}))
                
            }
        });

        this.app.get('/v1', (req, res) => {

          return res.json({ 
            name: 'DogeGarden API',
            support: 'https://discord.gg/JWDceH26Te',
            version: '1.3.1'
          })
        });
        
        this.app.get('/', (req, res) => {
           return res.sendStatus(200)
        });

        this.app.use((req, res) => {
            return res.sendStatus(404)
        });
    }

    async listen(fn) {
        if (!process.env.PORT) return Logger.error('Please add PORT= to your .env')
        this.server.listen(process.env.PORT, fn);
    }
}

module.exports = App;
