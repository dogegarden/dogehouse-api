import { Logger } from "./Logger";
// import { Calls } from "./functions";
import { raw, wrap, Wrapper, tokensToString, stringToToken, http } from "@dogehouse/kebab";
import logger from 'morgan';
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import axios from 'axios';
import info from './info.json'
const fs = require('fs').promises;
const dogesvg = "<svg version='1.0' xmlns='http://www.w3.org/2000/svg' width='512' height='512'><path d='M217.5 396.1c-2.7-.5-8.1-2.1-12-3.6-23.1-8.9-36.4-12.3-66-16.8-10.5-1.6-21.9-5.5-32-11-5.5-2.9-6-3.5-6.3-6.8-.4-4.7.4-4.9 17.4-5.6 15.5-.7 23.9.6 33.9 4.9 3.9 1.6 13.5 5.7 21.5 8.9 8 3.3 19 8.3 24.4 11 14.8 7.5 13.3 7.5 54.9-1.5 9.2-2.1 14.5-2.6 24.8-2.6h13l-.3 4.2-.3 4.1-14 4.9c-20.4 7.2-31.3 9.8-43.5 10.3-5.8.2-12.7 0-15.5-.4zM128.8 329c-12-2-25.6-12-30.2-22-3-6.6-5-21.1-4.5-33.3.3-7.2.8-8.9 3.1-12.3 5.2-7.5 20.7-14.9 35-16.6 17.1-2.1 32.3 1.5 49.5 11.8 12.9 7.7 15.3 11 15.3 21.2 0 5.8-1.7 9.4-10 21.6-16.6 24.5-34.5 33.6-58.2 29.6zm175.7-97.7c-4.4-.8-9.1-2.1-10.3-2.9-7.3-4.8-6.8-22.8.9-35.5 4.1-6.6 13-14.3 20.9-18.2 6.5-3.2 6.6-3.2 22-3.2 14.7 0 15.8.1 21.2 2.7 6.7 3.1 13.5 9.1 19.5 17.2 4.7 6.4 5.4 10.4 3.2 19.2-1.1 4.2-1.3 4.4-5 4.4-2.1 0-4.1-.5-4.4-1-.3-.6-3.6 2.1-7.3 5.9-8.7 8.9-13.1 10.4-29.7 9.9-10.4-.3-11.5-.1-11.5 1.5 0 1.4-.9 1.7-5.7 1.6-3.2-.1-9.4-.8-13.8-1.6zm17.6-10.5c.1-10.6 1.9-25 3.7-30 1.1-3.2 1.7-5.8 1.3-5.8-2.1 0-10.5 6.7-13.5 10.8-5.4 7.4-6 9.3-4.3 13.3 1.6 3.9 10.3 14.9 11.8 14.9.5 0 .9-1.5 1-3.2zm-178.6-25.2c-.5-.3-2.6-.7-4.6-1-2-.4-4.9-1.8-6.3-3.3-2.4-2.4-2.6-3.2-2.6-11.7.1-20.8 5.3-32.1 18-38.7 3.8-2 6-2.4 14.5-2.4 8.3 0 10.7.4 14 2.2 5.1 2.7 9 6.8 10.9 11.5 1.8 4.2 2.1 16.4.6 21.8-2.5 9-10.9 17.4-20 20-3.6 1.1-22.7 2.3-24.5 1.6zm.3-25.3-.4-2.8-.8 2.8c-.5 1.5-.5 3.9 0 5.5l.8 2.7.4-2.7c.2-1.6.2-4 0-5.5z'/><g fill='#efe7dc'><path d='M136.3 472c-51-6.8-90.8-46.9-96.4-97-.6-5.3-.9-54.6-.7-125.6l.4-116.9 3-10.5c5.8-19.6 14.2-34.6 26.8-47.9 14.7-15.4 31.7-25.4 52-30.7C138.1 39 141 38.9 261 39.2l114.5.3 11.5 2.9c11.5 2.9 25.1 8.2 30.2 11.7 1.4 1.1 2.9 1.9 3.3 1.9.3 0 3.8 2.4 7.8 5.3 24.3 18.1 40.7 47 43.8 77.2.6 6.4.9 52.1.7 125.5l-.4 115.5-3.2 11.1c-5.9 20.6-13.9 34.4-28.3 49.1-14.4 14.6-30.7 23.9-51.9 29.6l-11.5 3.2-117.5.1c-64.6.1-120.3-.2-123.7-.6zm114.2-81.5c12.4-3.2 36.8-11.9 37.3-13.3.7-2.3-18.6-1.5-31.5 1.4-32.6 7.1-35.7 7.6-43.3 7.1-6.6-.3-8.7-1-17.5-5.5-5.5-2.8-16.5-7.8-24.5-11.1-8-3.2-17.6-7.3-21.5-8.9-9.6-4.2-18.7-5.6-30.9-4.9-11 .7-14.9 1.4-14 2.8.9 1.6 15.4 8.5 23.4 11.2 4.1 1.4 12.7 3.3 19 4.1 23.8 3.3 38.2 7.1 61.5 16.1 3.9 1.5 9.3 3.1 12 3.5 7.2 1.2 19.6.2 30-2.5zm-97.7-66.6c12-4.1 21.6-12.9 33-30.2 7.8-11.8 8.8-14.7 7.3-20.4-1.3-4.8-4.3-7.7-14.4-13.7-25.7-15.4-47.7-16.1-70.5-2.3-10.3 6.2-12.5 12.7-10.3 31.4 1.5 12.3 4.5 19.2 11.3 25.6 5.7 5.3 15.7 10.5 22.6 11.7 6.1 1 14.4.2 21-2.1zM315.1 224c-11.2-11.3-12.7-18.8-6.1-28.8 5.7-8.5 13.9-14.2 20.5-14.2 3.6 0 3.9 1.8 1.2 8.1-3.4 7.7-4.6 14-4.9 25.2-.4 12.7-.1 13 13.3 12.5 13.1-.5 16.9-2.5 27.4-14.7l8-9.3.5 4.3c.7 6.2 2.6 6 4.1-.6l1.2-5.5-3.7-5.4c-5.3-7.7-13.7-15.3-20.3-18.4-5.3-2.5-6.8-2.7-18.3-2.7-12.2 0-12.7.1-19.4 3.4-8.1 3.9-19 14.3-22.4 21.3-3.7 7.7-4.9 15.1-3.2 20 2 5.6 5 7.5 14.5 9.2 14.4 2.5 14.4 2.5 7.6-4.4zM165 191c18.8-5.1 27.5-29.4 15.2-42.3-4.7-5-9.9-7.1-17.7-7.1-7.9 0-13.5 2.3-19.3 7.8-6.3 5.9-10.1 17.3-10.2 30.2 0 5.3.4 6.5 2.6 8.7 1.4 1.5 4.3 2.9 6.3 3.3 2 .3 4.1.7 4.6 1 1.5.6 14.5-.5 18.5-1.6z'/><path d='M147 187.2c-7.3-3.6-10.4-14.5-6.4-22.5 2.3-4.5 8.2-10.5 12.6-12.8 5.2-2.7 5.4-2.4 1.2 1.3-7.4 6.5-9.2 15.9-5.3 28.3 1.1 3.7 1.9 6.9 1.7 7.1-.2.2-1.9-.4-3.8-1.4z'/></g></svg>"
const premidsvg = '<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="1025.000000pt" height="1024.000000pt" viewBox="0 0 1025.000000 1024.000000" preserveAspectRatio="xMidYMid meet"> <g transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none"> </g> </svg>'
import { Calls } from './functions'
dotenv.config();

let wrapper: Wrapper;
try {
    raw.connect(
        process.env.DOGEHOUSE_TOKEN!,
        process.env.DOGEHOUSE_REFRESH_TOKEN!,
        {
            onConnectionTaken: () => {
                console.error("\nAnother client has taken the connection");
                process.exit();
            }
        }
    ).then((c) => {
        wrapper = wrap(c);
    })
} catch (error) {
    if (error.code === 4001) console.error("invalid token!");
    console.error(error)
}

const app = express();
const port = process.env.PORT!;
const server = require('http').createServer(app);
const io = require('socket.io')(server, { transports: ['websocket'], serveClient: false, path: '/socket' });

server.listen(7080);

io.on('connection', (socket) => {
    Logger.info('Socket Client Connected', io.sockets.sockets.size)

    socket.on('disconnect', async () => {
        await Calls.deleteBot(socket.id)
        Logger.info('Socket Client Disconnected', io.sockets.sockets.size)
    });

    socket.on('init', async function () {
        Logger.info('Socket Client Init', io.sockets.sockets.size,)
    })
    
    socket.on('transmit', async function (received) {
        if (!received.bot) return
        if (!received.bot.uuid) return
        if (!received.bot.username) return
        let new_data = {
            socket_id: socket.id,
            bot: { uuid: received.bot.uuid, username: received.bot.username || 'A Default Doge', avatar: received.bot.avatarURL  || 'https://cdn.discordapp.com/attachments/824724836936187974/824936185734234132/orangeDiscordIcon.png'},
            room: { uuid: received.room.uuid, name: received.room.name || 'No Room', listening: received.room.listening || 0, users: received.room.users || [] }

        }
        await Calls.transmitBot(received.bot.uuid, new_data)
        Logger.info('Socket Client Transmit', socket.id, received.bot.uuid, received.bot.username)

    });

    socket.on('error', (err) => {
        Logger.error('Socket Error', socket.id, err)
    });
});

app.use(cors({
    origin: "*"
}))

app.use(logger(':remote-addr >> :method :url :status :res[content-length] - :response-time ms'));
   
app.get('/v1/shields', async (req, res) => { 
    try {
        let rooms = (await wrapper.query.getTopPublicRooms()).rooms;

        return res.send({
            schemaVersion: 1,
            label: "DogeHouse",
            message: rooms.map(it => it.numPeopleInside).reduce((a, b) => a + b, 0) + " online",
            logoSvg: dogesvg,
            color: "green"
        })
    } catch (err) {
        return(res.send({
            schemaVersion: 1,
            label: "DogeHouse",
            isError: true,
            message: err,
            logoSvg: dogesvg,
            color: "orange"
        }))
    }
});

app.get('/v1/shields/users', async (req, res) => {
    try {
        let rooms = (await wrapper.query.getTopPublicRooms()).rooms;

        return res.send({
            schemaVersion: 1,
            label: "DogeHouse",
            message: rooms.map(it => it.numPeopleInside).reduce((a, b) => a + b, 0) + " online",
            logoSvg: dogesvg,
            color: "green"
        })
    } catch (err) {
        return(res.send({
            schemaVersion: 1,
            label: "DogeHouse",
            isError: true,
            message: err,
            logoSvg: dogesvg,
            color: "orange"
        }))
    }
});

app.get('/v1/popularRooms', async (req, res) => {
    try {
        return res.json(await wrapper.query.getTopPublicRooms())
    } catch(err) {
        return(res.send({"Error": err}))
    }
});

app.get('/v1/bots', async (req, res) => {
    try {
        console.log(await Calls.getAllBots())
        return res.json(await Calls.getAllBots())
    } catch(err) {
        return(res.send({"Error": err}))
    }
});

app.get('/v1/scheduledRooms', async (req, res) => {
    try {
        return res.json({rooms: await wrapper.query.getScheduledRooms()})
    } catch(err) {
        return(res.send({"Error": err}))
    }
});

app.get('/v1/statistics', async (req, res) => {
    try {
        // let bots_length = await Calls.getAllBotsLength()
        let bots_length = 0;
        let rooms = (await wrapper.query.getTopPublicRooms()).rooms;
        let scheduledRooms = (await wrapper.query.getScheduledRooms()).scheduledRooms;
        return res.send({
            totalRooms: rooms.length,
            totalScheduledRooms: scheduledRooms.length,
            totalRegistered: (await axios.get("https://api.dogehouse.tv/stats")).data.numUsers,
            totalOnline: rooms.map(it => it.numPeopleInside).reduce((a, b) => a + b, 0),
            totalBotsOnline: io.sockets.sockets.size,
            totalBotsSendingTelemetry: bots_length
        })
    } catch (err) {
        return(res.send({"Error": err}))
    }
});

app.get('/v1/search/:query', async (req, res) => {
    return res.json(await wrapper.query.search(`${(req.query.type == "room") ? '' : '@'}${req.params.query}`));
});

app.get('/v1', (req, res) => {

    return res.json({ 
      name: info.name,
      support: info.support,
      version: info.version
    })
});

app.get('/', (req, res) => {

    return res.json({ 
      name: info.name,
      support: info.support,
      version: info.version
    })
});

app.use((req, res) => {
    return res.sendStatus(404)
});

app.listen( port, () => {
    Logger.route( `Running on http://localhost:${ port }` );
} );
