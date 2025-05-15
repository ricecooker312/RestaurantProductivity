const express = require('express')
const cors = require('cors')

const app = express()
app.use( express.json() )
app.use( cors() )

const port = 3000

const path = require('path')
const dotenv = require('dotenv')
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const mongoClient = require('./dbconn')

const database = mongoClient.db('restaurantpd')
const users = database.collection('users')

const jwt = require('jsonwebtoken')

app.get('/api/users/all', async (req, res) => {
    const allUsers = await users.find({}).toArray()
    console.log(allUsers)

    res.send(allUsers)
})

app.post('/api/users/register', async (req, res) => {
    const { email, password } = req.body

    const emailCheck = await users.find({ email: 'email' }).toArray()

    if (emailCheck.length === 0) {
        const doc = { email: email, password: password }
        const result = await users.insertOne(doc)

        const user = { id: result.insertedId, email: email }
        const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET)  

        res.send({ accessToken: accessToken })
    } else {
        res.send({ emailError: 'That email already exists' })
    }
})

app.post('/api/users/singout', (req, res) => {
    
})

app.listen(port, (err) => {
    if (err) console.log(`Server error: ${err}`)
    console.log(`Server running on port ${port}`)
})