const express = require('express')
const cors = require('cors')

const app = express()
app.use( express.json() )
app.use( cors() )

const path = require('path')
require('dotenv').config()

const port = process.env.PORT

const bcrypt = require('bcrypt')

const mongoClient = require('./dbconn')
const { ObjectId } = require('mongodb')

const database = mongoClient.db('restaurantpd')

const users = database.collection('users')
const goals = database.collection('goals')
const items = database.collection('items')
const userItems = database.collection('userItems')

const jwt = require('jsonwebtoken')

const checkToken = (req, res, next) => {
    const tokenHeader = req.headers['authorization']

    if (!tokenHeader) return res.status(401).send({
        'error': 'Token not found'
    })

    const token = tokenHeader.split(' ')[1]

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log(err)
            return res.status(403).send({
                'error': 'Unauthorized'
            })
        }
        
        req.user = user

        return next()
    })
}

app.get('/', (req, res) => {
    return res.send('Welcome to the app!')
})

app.get('/api/users/all', async (req, res) => {
    const allUsers = await users.find({}).toArray()

    return res.send(allUsers)
})

app.post('/api/users/register', async (req, res) => {
    const { email, password } = req.body

    const emailCheck = await users.find({ email: email }).toArray()

    if (emailCheck.length === 0) {
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt)

        const doc = { email: email, password: hashedPassword, coins: '25' }
        const result = await users.insertOne(doc)

        const user = { id: result.insertedId, email: email }
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)  

        return res.send({ accessToken: accessToken, coins: 25 })
    } else {
        return res.send({ emailError: 'That email already exists' })
    }
})

app.post('/api/users/login', async (req, res) => {
    const { email, password } = req.body

    const usersFind = await users.find({ email: email }).toArray()
    if (usersFind.length > 1) res.send({ error: 'An error occurred' })
    else if (usersFind.length < 1) res.send({ error: 'Email or password is incorrect' })
    else if (usersFind.length === 1) {
        const compare = await bcrypt.compare(password, usersFind[0].password)

        if (compare) {
            const foundUser = usersFind[0]

            const user = { id: foundUser._id, email: foundUser.email }
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
            
            return res.send({ accessToken: accessToken, coins: `${foundUser.coins}` })
        } else {
            return res.send({ error: 'Email or password is incorrect' })
        }
    }
})

app.patch('/api/users/update', checkToken, async (req, res) => {
    const { email } = req.body
    const userId = req.user.id

    try {
        const userFind = await users.findOne({ _id: new ObjectId(userId) })
        if (!userFind) {
            return res.send({
                error: 'That user does not exist'
            })
        }

        const userUpdate = await users.updateOne(userFind, {
            $set: {
                email: email
            }
        })
        
        return res.send(userUpdate)
    } catch (err) {
        console.log(err)
        return res.send({
            error: err
        })
    }
})

app.delete('/api/users/delete', checkToken, async (req, res) => {
    const userId = req.user.id

    try {
        const userFind = users.findOne({ _id: new ObjectId(userId) })
        if (!userFind) {
            return res.send({
                error: 'That user does not exist'
            })
        }

        const userDelete = await users.deleteOne(userFind)

        const itemsDelete = await userItems.deleteMany({ userId: userId })
        const goalsDelete = await goals.deleteMany({ userId: userId })

        return res.send({
            userDelete: userDelete,
            itemsDelete: itemsDelete,
            goalsDelete: goalsDelete
        })
    } catch (err) {
        console.log(`One User Delete Error: ${err}`)

        return res.send({
            error: err
        })
    }
})

app.delete('/api/users/delete/all', async (req, res) => {
    try {
        const usersDelete = users.deleteMany({})
        return res.send(usersDelete)
    } catch (err) {
        return res.send(err)
    }
})

app.get('/api/goals/find/all', checkToken, async (req, res) => {
    const userId = req.user.id
    
    try {
        const goalFind = await goals.find({ userId: userId }).toArray()

        return res.send(goalFind)
    } catch (err) {
        console.log(`Goal Find Error: ${err}`)
        return res.send({
            error: err
        })
    }
})

app.get('/api/goals/find/incomplete', checkToken, async (req, res) => {
    const userId = req.user.id

    try {
        const goalFind = await goals.find({ completed: false, userId: userId }).toArray()

        return res.send(goalFind)
    } catch (err) {
        console.log(`Incomlete Goal Find error: ${err}`)
        return res.send({
            error: err
        })
    }
})

app.get('/api/goals/find/:goalId', checkToken, async (req, res) => {
    const userId = req.user.id
    const goalId = req.params.goalId

    try {
        const goalFind = await goals.findOne({ _id: new ObjectId(goalId) })

        if (!goalFind) {
            return res.send({
                'error': 'That goal does not exist'
            })
        } else if (goalFind.userId !== userId) {
            return res.send({
                'error': 'Unauthorized'
            })
        }

        return res.send(goalFind)
    } catch (err) {
        console.log(`One Goal Find Error: ${err}`)
        return res.send({
            'error': err
        })
    }
})

app.post('/api/goals/new', checkToken, async (req, res) => {
    const { title, description, completed, type, priority, difficulty } = req.body

    let reward = 1

    if (type === 'goal') reward *= 2

    if (priority === 'medium') reward *= 2
    else if (priority === 'high') reward *= 3

    if (difficulty === 'medium') reward *= 2
    else if (difficulty === 'hard') reward *= 3

    const time = new Date()
    const goalsDoc = { 
        title: title, 
        description: description,
        completed: completed, 
        type: type,
        priority: priority, 
        difficulty: difficulty, 
        reward: reward,
        userId: req.user.id,
        time: `${time.toLocaleDateString()} ${time.toLocaleTimeString()}`
    }

    try {
        const result = await goals.insertOne(goalsDoc)
        result.reward = reward

        return res.send(result)
    } catch (error) {
        console.log(`Server Error: ${error}`)
        return res.send({
            error: error
        })
    }
})

app.patch('/api/goals/:goalId/complete', checkToken, async (req, res) => {
    const goalId = req.params.goalId
    const userId = req.user.id

    try {
        const goalFind = await goals.findOne({ _id: new ObjectId(goalId) })
        if (!goalFind) {
            return res.send({
                error: 'This goal does not exist'
            })
        }

        if (goalFind.userId !== userId) {
            return res.send({
                error: "You don't own this goal"
            })
        }

        const time = new Date()
        const updateGoal = await goals.updateOne(goalFind, 
            {
                $set: {
                    completed: goalFind.completed ? false : true,
                    lastUpdated: `${time.toLocaleDateString()} ${time.toLocaleTimeString()}`
                }
            }
        )

        if (!goalFind.completed) {
            const userFind = await users.findOne({ _id: new ObjectId(userId) })
            if (!userFind) {
                return res.send({
                    'error': 'That user does not exist'
                })
            }

            const newCoins = userFind.coins + goalFind.reward
            const addCoins = await users.updateOne(userFind, {
                $set: {
                    coins: newCoins
                }
            })

            return res.send({
                ...addCoins,
                coins: newCoins
            })
        }

        return res.send(updateGoal)
    } catch (err) {
        console.log(`Goal Complete Error: ${err}`)
    }
})

app.patch('/api/goals/:goalId/update', checkToken, async (req, res) => {
    const goalId = req.params.goalId
    const userId = req.user.id

    const { title, description, completed, type, priority, difficulty } = req.body

    try {
        const goalFind = await goals.findOne({ _id: new ObjectId(goalId) })
        if (goalFind.userId !== userId) {
            return res.send({
                'error': 'Unauthorized'
            })
        }

        const time = new Date()
        const updateGoal = await goals.updateOne(goalFind, {
            $set: {
                title: title,
                description: description,
                completed: completed,
                type: type,
                priority: priority,
                difficulty: difficulty,
                lastUpdated: `${time.toLocaleDateString()} ${time.toLocaleTimeString()}`
            }
        })

        return res.send(updateGoal)
    } catch (err) {
        console.log(`Update Goal Error: ${err}`)
        return res.send({
            'error': err
        })
    }
})

app.delete('/api/goals/:goalId/delete', checkToken, async (req, res) => {
    const goalId = req.params.goalId
    const userId = req.user.id
    
    try {
        const goalFind = await goals.findOne({ _id: new ObjectId(goalId) })
        if (goalFind.userId !== userId) {
            return res.send({
                error: 'Unauthorized'
            })
        }

        const goalDelete = await goals.deleteOne(goalFind)

        return res.send(goalDelete)
    } catch (err) {
        console.log(`Goal Delete Error: ${err}`)
    }
})

app.delete('/api/goals/delete/all', async (req, res) => {
    try {
        const goalsDelete = goals.deleteMany({})
        return res.send(goalsDelete)
    } catch (err) {
        return res.send(err)
    }
})

app.get('/api/items/find/all', async (req, res) => {
    try {
        const allItems = await items.find({}).toArray()

        return res.send(allItems)
    } catch (err) {
        console.log(err)
        return res.send({
            error: err
        })
    }
})

app.get('/api/items/user/find/unowned/all', checkToken, async (req, res) => {
    const userId = req.user.id

    try {
        const allItems = await items.find({}).project({ _id: 1 }).sort({ price: 1 }).toArray()
        const allItemIds = allItems.map(item => item._id.toString())

        const ownedItems = await userItems.find({ userId: userId }).project({ itemId: 1 }).toArray()
        const ownedItemIds = ownedItems.map(item => item.itemId.toString())

        const unownedItemIds = allItemIds.filter(id => !ownedItemIds.includes(id))
        const unownedItems = []

        for (let i = 0; i < unownedItemIds.length; i++) {
            const unownedItem = await items.findOne({ _id: new ObjectId(unownedItemIds[i]) })
            if (!unownedItem) {
                return res.send({
                    'error': 'That unowned item does not exist'
                })
            }

            unownedItems.push(unownedItem)
        }

        return res.send(unownedItems)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
})

app.get('/api/items/user/find/all', checkToken, async (req, res) => {
    const userId = req.user.id
    const resultItems = []

    try {
        const uItems = await userItems.find({ userId: userId }).toArray()
        for (let i = 0; i < uItems.length; i++) {
            const item = await items.findOne({ _id: new ObjectId(uItems[i].itemId) })
            if (!item) {
                return res.send({
                    'error': 'That item does not exist'
                })
            }

            item.level = uItems[i].level
            resultItems.push(item)
        }

        return res.send(resultItems)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
})
app.get('/api/items/user/find/:itemId', checkToken, async (req, res) => {
    const userId = req.user.id
    const itemId = req.params.itemId

    try {
        const uItem = await userItems.findOne({ userId: userId, itemId: itemId })
        if (!uItem) {
            return res.send({
                'error': 'The item does not exist'
            })
        }

        return res.send(uItem)
    } catch (err) {
        console.log(err)
        return res.send({
            error: err
        })
    }
})

app.post('/api/items/add', async (req, res) => {
    const { name, image, type, price, maxLevel, features } = req.body

    try {
        const item = { name: name, image: image, type: type, price: price, maxLevel: maxLevel, features: features }
        const insert = await items.insertOne(item)

        return res.send(insert)
    } catch (err) {
        console.log(err)
        return res.send({
            error: err
        })
    }
})

app.post('/api/items/user/buy', checkToken, async (req, res) => {
    const userId = req.user.id
    const { itemId } = req.body

    try {
        const item = await items.findOne({ _id: new ObjectId(itemId) })
        if (!item) {
            return res.send({
                error: 'That item does not exist'
            })
        }

        const user = await users.findOne({ _id: new ObjectId(userId) })
        if (!user.coins) {
            return res.send({
                error: 'That user does not exist or does not have coins'
            })
        }
        
        const newCoins = user.coins - item.price

        const time = new Date()
       
        const newItemDoc = { 
            userId: userId, 
            itemId: itemId,
            level: 1,
            boughtAt: `${time.toLocaleDateString()} ${time.toLocaleTimeString()}` 
        }
        const newItem = await userItems.insertOne(newItemDoc)

        const updateUser = await users.updateOne(user, {
            $set: {
                coins: newCoins
            }
        })

        return res.send({
            ...newItem,
            coins: newCoins
        })
    } catch (err) {
        console.log(err)
        return res.send({
            error: err
        })
    }
})

app.delete('/api/items/user/sell', checkToken, async (req, res) => {
    const userId = req.user.id
    const { itemId } = req.body

    try {
        const user = await users.findOne({ _id: new ObjectId(userId) })
        if (!user) {
            return res.send({
                error: 'That user does not exist'
            })
        }

        const uItem = await userItems.findOne({ itemId: itemId, userId: userId })
        if (!uItem) {
            return res.send({
                'error': "You don't own this item"
            })
        }

        const item = await items.findOne({ _id: new ObjectId(itemId) })
        if (!item) {
            return res.send({
                'error': 'That item does not exist'
            })
        }

        const deleteItem = await userItems.deleteOne(uItem)

        const newCoins = user.coins + item.price
        const addCoins = await users.updateOne(user, {
            $set: {
                coins: newCoins
            }
        })

        return res.send({
            ...deleteItem,
            coins: newCoins
        })
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
})

app.patch('/api/items/user/upgrade/', checkToken, async (req, res) => {
    const userId = req.user.id
    const { itemId } = req.body

    try {
        const userItemFind = await userItems.findOne({ itemId: itemId, userId: userId })
        if (!userItemFind) {
            return res.send({
                error: "You don't own this item or it doesn't exist"
            })
        }

        const item = await items.findOne({ _id: new ObjectId(itemId) })

        const newLevel = userItemFind.level + 1

        if (item.maxLevel >= newLevel) {
            const upgrade = await userItems.updateOne(userItemFind, {
                $set: {
                    level: newLevel
                }
            })

            return res.send({
                ...upgrade,
                level: newLevel
            })
        } else {
            return res.send({
                'error': 'Item is already at max level'
            })
        }
    } catch (err) {
        console.log(err)
        return res.send({
            error: err
        })
    }
})

app.patch('/api/items/user/upgrade/final', checkToken, async (req, res) => {
    const userId = req.user.id
    const { itemId } = req.body

    try {
        const userItemFind = await userItems.findOne({ itemId: itemId, userId: userId })
        if (!userItemFind) {
            return res.send({
                error: "You don't own this item or it doesn't exist"
            })
        }

        const item = await items.findOne({ _id: new ObjectId(itemId) })

        const newLevel = userItemFind.level + 1

        if (item.maxLevel > newLevel) {
            const upgrade = await userItems.updateOne(userItemFind, {
                $set: {
                    level: newLevel
                }
            })

            return res.send({
                ...upgrade,
                level: newLevel
            })
        } else {
            return res.send({
                'error': 'Item is already at max level'
            })
        }
    } catch (err) {
        console.log(err)
        return res.send({
            error: err
        })
    }
})

app.listen(port, (err) => {
    if (err) console.log(`Server error: ${err}`)
    console.log(`Server running on port ${port}`)
})