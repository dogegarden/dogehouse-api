const Debug = require('debug')

const logger = Debug('DogeGarden')
const info = logger.extend('info')
info.log = console.info.bind(console)

const error = logger.extend('error')
error.log = console.error.bind(console)

const log = logger.extend('log')
log.log = console.log.bind(console)

const warn = logger.extend('warning')
warn.log = console.warn.bind(console)

const routeLog = logger.extend('warn')
routeLog.color = 32

const apiLog = logger.extend('API')
apiLog.color = 40

module.exports = { log, error, info, warn, routeLog, apiLog }
