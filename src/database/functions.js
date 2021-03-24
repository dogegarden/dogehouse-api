const monk = require('monk');
const db = monk(process.env.MONGO_URL);

class Calls {

    static async insertBot(socket_id) {
        const collection = db.get('bots')
        let data = {
            socket_id: socket_id
        }
        return (await collection.insert(data))
    }

    static async deleteBot(socket_id) {
        const collection = db.get('bots')
        return (await collection.findOneAndDelete({ socket_id: socket_id }))
    }

    static async formatBots() {
        const collection = db.get('bots')
        return (await collection.remove({ }))
    }
    
    static async editBot(socket_id, data_object) {
        const collection = db.get('bots')
        return (await collection.update({ socket_id: socket_id }, { $set: data_object } ))
    }

    static async getAllBots() {
        const collection = db.get('bots')
        return (await collection.find({}))
    }

    static async getAllBotsLength() {
        const collection = db.get('bots')
        return (await collection.count())
    }

    static async getBotBySocket(id) {
        const collection = db.get('bots')
        return (await collection.findOne({ socket_id: id }))
    }

    static async getBotByUUID(uuid) {
        const collection = db.get('bots')
        return (await collection.findOne({ uuid: uuid }))
    }

    static async getBotByUsername(username) {
        const collection = db.get('bots')
        return (await collection.findOne({ username: username }))
    }
}

module.exports = Calls;
