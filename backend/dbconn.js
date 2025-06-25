require('dotenv').config()

const { MongoClient } = require('mongodb')
const uri = process.env.MONGODB_CONNECTION_STR

const client = new MongoClient(uri, {
    tls: true,
})

const last = new Date(1750805700000)
const now = new Date(1750884877039)

console.log('now:', now.toUTCString());
console.log('last:', last.toUTCString());

console.log('now date:', now.getUTCDate());
console.log('last date:', last.getUTCDate());

console.log (
    now.getUTCFullYear() !== last.getUTCFullYear() ||
    now.getUTCMonth() !== last.getUTCMonth() ||
    now.getUTCDate() !== last.getUTCDate()
)

module.exports = client