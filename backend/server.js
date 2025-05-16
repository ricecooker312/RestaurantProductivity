const express = require('express')
const cors = require('cors')

const app = express()
app.use( express.json() )
app.use( cors() )

const port = 3000

const path = require('path')
const dotenv = require('dotenv')
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const bcrypt = require('bcrypt')

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
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt)

        const doc = { email: email, password: hashedPassword }
        const result = await users.insertOne(doc)

        const user = { id: result.insertedId, email: email }
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)  

        res.send({ accessToken: accessToken })
    } else {
        res.send({ emailError: 'That email already exists' })
    }
})

app.post('/api/users/login', async (req, res) => {
    const { email, password } = req.body

    const usersFind = await users.find({ email: email }).toArray()
    if (usersFind.length > 1) res.send({ error: 'An error occurred' })
    else if (usersFind.length < 1) res.send({ error: 'Email or password is incorrect' })
    else if (usersFind.length === 1) {
        console.log(usersFind[0].password)
        const compare = await bcrypt.compare(password, usersFind[0].password)

        if (compare) {
            console.log('correct password')
            const foundUser = usersFind[0]

            const user = { id: foundUser._id, email: foundUser.email }
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
            
            res.send({ accessToken: accessToken })
        } else {
            res.send({ error: 'Email or password is incorrect' })
        }
    }
})

app.post('/api/users/singout', (req, res) => {
    
})

app.listen(port, (err) => {
    if (err) console.log(`Server error: ${err}`)
    console.log(`Server running on port ${port}`)
})