require('dotenv').config()

const { MongoClient } = require('mongodb')
const uri = process.env.MONGODB_CONNECTION_STR

const client = new MongoClient(uri, {
    tls: true,
})

const now = new Date(1750651274804)
const time = new Date()

console.log('now:', now.toUTCString());
console.log('time: ', time.toUTCString())

console.log(
    now.getUTCFullYear() !== time.getUTCFullYear() ||
    now.getUTCMonth() !== time.getUTCMonth() ||
    now.getUTCDate() + 2 <= time.getUTCDate()    
)

module.exports = client