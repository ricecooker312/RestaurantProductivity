require('dotenv').config()

const { MongoClient } = require('mongodb')
const uri = process.env.MONGODB_CONNECTION_STR

const client = new MongoClient(uri, {
    tls: true,
})

const now = new Date(1750804395265)
const time = new Date()

console.log('now:', now.toUTCString());
console.log('time: ', time.toUTCString())

module.exports = client