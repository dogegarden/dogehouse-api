const express = require('express')
const router = express.Router()
const package = require('../package.json')

const api = (connection) => {
    router.get('/rooms', async (req, res) => {
        try {
            let rooms = await connection.fetch('get_top_public_rooms', {
                cursor: 0,
            })
            res.status(200).json(rooms)
        } catch (err) {
            res.status(404).json(err)
        }
    })

    router.get('/', (req, res) => {
        res.json({
            name: 'DogeGardenAPI',
            version: package.version,
            timestamp: new Date(),
        })
    })

    return router
}
module.exports = api
