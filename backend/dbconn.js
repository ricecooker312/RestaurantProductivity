const path = require('path')
const dotenv = require('dotenv')
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const { MongoClient } = require('mongodb')
const uri = process.env.MONGODB_CONNECTION_STR

const client = new MongoClient(uri)

module.exports = client