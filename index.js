require('dotenv').config();
const client = new (require('./src/classes/App'));
const Logger = require('./src/util/Logger');

(async function () {
    await client.registerRoutes();
    await client.listen(() => {
        Logger.info(`Express serving on port ${process.env.PORT}`);
    }, true);
})();