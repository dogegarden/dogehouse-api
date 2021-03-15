const express = require('express')
const app = express()
const port = 5000
const package = require('./package.json')
require("dotenv").config();

async function ready() {

const { connect } = require('@dogehouse/client');

const connection = await connect(
    process.env.DOGEHOUSE_TOKEN,
    process.env.DOGEHOUSE_REFRESH_TOKEN,
    {}
);
app.get('/rooms', async (req, res) => {
    let rooms = await connection.fetch("get_top_public_rooms", { cursor: 0 });
    res.send(rooms)
})

app.get('/', (req, res) => {
  res.json({ 
    name: 'DogeGardenAPI',
    version: package.version,
    timestamp: new Date()
   })
})

app.listen(port, () => {
  console.log(`Sending from port ${port}.`)
})
}
ready();