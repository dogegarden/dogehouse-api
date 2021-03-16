const Route = require('express').Router;
class Router {
    /**
     * 
     * @param {import('./App')} client 
     * @param {string} path
     * @param {boolean} auth
     */
    constructor(client, path, auth = false) {
        this.client = client;
        this.path = path;
        this.auth = auth;
        this.router = Route();
    }
    createRoute() {
        return this.router;
    }
}
module.exports = Router;
