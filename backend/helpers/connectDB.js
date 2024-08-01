const { MongoClient } = require('mongodb')

const uri = 'mongodb://localhost:27017'
const dbName = 'medicalportal'
let db = null
const client = new MongoClient(uri)

async function getDatabase() {
    try {
        await client.connect()

        db = client.db(dbName)
        return db
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}

module.exports = { getDatabase, client }
