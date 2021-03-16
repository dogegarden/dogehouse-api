const Debug = require('debug')

const logger = Debug('DogeGarden')
const info = logger.extend('info')
info.log = console.info.bind(console)

const error = logger.extend('error')
error.log = console.error.bind(console)

const log = logger.extend('log')
log.log = console.log.bind(console)

module.exports = { log, error, info }
