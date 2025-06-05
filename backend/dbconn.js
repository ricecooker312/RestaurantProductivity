const path = require('path')
require('dotenv').config()

const { MongoClient } = require('mongodb')
const uri = process.env.MONGODB_CONNECTION_STR

const client = new MongoClient(uri, {
    tls: true,
})

module.exports = client