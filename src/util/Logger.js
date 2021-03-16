const chalk = require('chalk')
const dateFormat = require('dateformat')
const util = require('util')
const Debug = require('debug')
const { info, warn, error, routeLog, apiLog } = require('./DebugLog')

class Logger {
    static get prefix() {
        return chalk.gray(dateFormat(Date.now(), 'ddd HH:MM:ss:l'))
    }

    static formatInput(args) {
        return args.map((arg) =>
            arg instanceof Object ? util.inspect(arg) : arg
        )
    }

    static info(...args) {
        args = this.formatInput(args)
        info(this.prefix, args.join(' '))
    }

    static route(...args) {
        args = this.formatInput(args)
        routeLog(this.prefix, args.join(' '))
    }

    static API(...args) {
        args = this.formatInput(args)
        apiLog(this.prefix, args.join(' '))
    }

    static warn(...args) {
        args = this.formatInput(args)
        warn(this.prefix, arg.join(' '))
    }

    static error(...args) {
        args = this.formatInput(args)
        error(this.prefix, args.join(' '))
    }
}

module.exports = Logger
