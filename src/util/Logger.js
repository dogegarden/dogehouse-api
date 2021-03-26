const chalk = require('chalk');
const dateFormat = require('dateformat');
const util = require('util')

class Logger {
    static get prefix() {
        return chalk.gray(dateFormat(Date.now(), 'ddd HH:MM:ss:l'))
    }

    static formatInput(args) {
        return args.map((arg) => arg instanceof Object ? util.inspect(arg) : arg)
    }

    static info(...args) {
        args = this.formatInput(args)
        console.log(this.prefix + ' ' + chalk.green('[INFO]') + ' ' + args.join(' '))
    }

    static error(...args) {
        args = this.formatInput(args)
        console.log(this.prefix + ' ' + chalk.red('[ERROR]') + ' ' + args.join(' '))
    }

    static route(...args) {
        args = this.formatInput(args)
        console.log(this.prefix + ' ' + chalk.blue('[ROUTE]') + ' ' + args.join(' '))
    }

    static API(...args) {
        args = this.formatInput(args)
        console.log(this.prefix + ' ' + chalk.cyan('[API]') + ' ' + args.join(' '))
    } 

}

module.exports = Logger;