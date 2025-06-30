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
const friends = database.collection('friends')
const restaurants = database.collection('restaurants')

const jwt = require('jsonwebtoken')

const day = 86400000

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

const isNewDay = (lastTime, nowTime) => {
    const last = new Date(lastTime)
    const now = new Date(nowTime)

    return (
        now.getUTCFullYear() !== last.getUTCFullYear() ||
        now.getUTCMonth() !== last.getUTCMonth() ||
        now.getUTCDate() !== last.getUTCDate()
    )
}

const twoDaysPassed = (lastTime, nowTime) => {
    const last = new Date(lastTime)
    const now = new Date(nowTime)

    return (
        last.getUTCFullYear() !== last.getUTCFullYear() ||
        last.getUTCMonth() !== last.getUTCMonth() ||
        last.getUTCDate() + 2 <= now.getUTCDate()
    )
}

app.get('/', (req, res) => {
    return res.send('Welcome to the app!')
})

app.get('/api/users/find/all', checkToken, async (req, res) => {
    const allUsers = await users.find({}).project({ password: 0 }).toArray()

    return res.send(allUsers)
})

app.get('/api/users/find', checkToken, async (req, res) => {
    const userId = req.user.id

    try {
        const userFind = await users.findOne({ _id: new ObjectId(userId) })
        if (!userFind) {
            return res.send({
                error: 'No users with that email found'
            })
        }

        return res.send(userFind)
    } catch (err) {
        console.log(`One User Find Error: ${err}`)
        return res.send({
            error: err
        })
    }
})

app.post('/api/users/search', checkToken, async (req, res) => {
    const { email } = req.body

    try {
        const userFind = await users.findOne({ email: email })
        if (!userFind) {
            return res.send({
                error: 'No users with that email'
            })
        }

        return res.send(userFind)
    } catch (err) {
        console.log(`User Find By Email Error: ${err}`)
        return res.send({
            error: err
        })
    }
})

app.post('/api/users/register', async (req, res) => {
    const { email, password } = req.body

    const emailCheck = await users.find({ email: email }).toArray()

    if (emailCheck.length === 0) {
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt)

        const time = new Date()
        const doc = { 
            email: email, 
            password: hashedPassword, 
            coins: 25,
            streak: 1,
            gotStreak: true,
            createdAt: `${time.toLocaleDateString()} ${time.toLocaleTimeString()}`,
            streakTime: time.getTime()
        }
        const result = await users.insertOne(doc)

        const restaurantDoc = {
            level: 1,
            stats: [
                { feature: "Average customer amount", amount: '0', ending: '' },
                { feature: "Average customer stay time", amount: '0', ending: "minutes" },
                { feature: "Average food prep time", amount: "0", ending: 'minutes' },
                { feature: "Average profit", amount: "$0", ending: '' },
                { feature: "Average review", amount: "0", ending: "stars" }
            ],
            images: ['https://i.ibb.co/Nn79dPYn/lvlonerestaurant.png'],
            userId: result.insertedId.toString()
        }
        await restaurants.insertOne(restaurantDoc)

        const user = { id: result.insertedId, email: email }
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)  

        return res.send({ 
            accessToken: accessToken, 
            coins: 25,
            restaurantImage: 'https://i.ibb.co/Nn79dPYn/lvlonerestaurant.png'
        })
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

        if (email !== userFind.email) {
            const emailCheck = await users.find({ email: email }).toArray()
            if (emailCheck.length > 0) {
                return res.send({
                    error: 'That email already exists'
                })
            }
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

app.delete('/api/users/delete/all', checkToken, async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.send({
            error: 'Email and password is required to verify identify before deleting'
        })
    }

    try {
        const usersDelete = await users.deleteMany({})
        const goalsDelete = await goals.deleteMany({})
        const friendsDelete = await friends.deleteMany({})
        const uItemsDelete = await userItems.deleteMany({})
        const restaurantsDelete = await restaurants.deleteMany({})

        return res.send({
            usersDelete: usersDelete,
            goalsDelete: goalsDelete,
            friendsDelete: friendsDelete,
            uItemsDelete: uItemsDelete,
            restuarantsDelete: restaurantsDelete
        })
    } catch (err) {
        console.log(`All Users Delete Error: ${err}`)
        return res.send({
            error: err
        })
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

app.post('/api/goals/find/complete', checkToken, async (req, res) => {
    const userId = req.user.id
    const { friendId } = req.body

    try {
        const goalsFind = await goals.find({ userId: friendId ? friendId : userId, completed: true }).toArray()

        return res.send(goalsFind)
    } catch (err) {
        console.log(`Completed Goals Find Error: ${err}`)
        return res.send({
            error: err
        })
    }
})

app.get('/api/goals/find/incomplete', checkToken, async (req, res) => {
    const userId = req.user.id

    try {
        const goalFind = await goals.find({ completed: false, userId: userId }).toArray()

        const user = await users.findOne({ _id: new ObjectId(userId) })
        if (!user) {
            return res.send({
                error: 'The user does not exist',
                userNotExist: true
            })
        }

        return res.send({
            goals: goalFind,
            streak: user.streak
        })
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
    const userId = req.user.id

    const time = new Date()

    let reward = 1

    if (type === 'goal') reward *= 2

    if (priority === 'medium') reward *= 2
    else if (priority === 'high') reward *= 3

    if (difficulty === 'medium') reward *= 2
    else if (difficulty === 'hard') reward *= 3

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

        const user = await users.findOne({ _id: new ObjectId(userId) })
        if (!user) {
            return res.send({
                error: 'The user does not exist'
            })
        }

        if (isNewDay(user.streakTime, time.getTime()) && user.gotStreak) {
            await users.updateOne(user, {
                $set: {
                    gotStreak: false
                }
            })
            user.gotStreak = false
        }

        let streak = user.streak

        if (twoDaysPassed(user.streakTime, time.getTime()) && !user.gotStreak) {
            await users.updateOne({ _id: user._id }, {
                $set: {
                    gotStreak: true,
                    streak: 1,
                    streakTime: time.getTime()
                }
            })

            streak = 1
        } else if (!twoDaysPassed(user.streakTime, time.getTime()) && !user.gotStreak) {
            const newStreak = user.streak + 1
            await users.updateOne(user, {
                $set: {
                    streak: newStreak,
                    gotStreak: true,
                    streakTime: time.getTime()
                }
            })

            streak++
        }

        result.streak = streak
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

            if (isNewDay(userFind.streakTime, time.getTime()) && userFind.gotStreak) {
                await users.updateOne({ _id: userFind._id }, {
                    $set: {
                        gotStreak: false
                    }
                })
                userFind.gotStreak = false
            }

            const newCoins = userFind.coins + goalFind.reward
            const addCoins = await users.updateOne(userFind, {
                $set: {
                    coins: newCoins
                }
            })

            let streak = userFind.streak
            if (twoDaysPassed(userFind.streakTime, Date.now()) && !userFind.gotStreak) {
                await users.updateOne({ _id: userFind._id }, {
                    $set: {
                        streak: 1,
                        gotStreak: true,
                        streakTime: time.getTime()
                    }
                })

                streak = 1
            } else if (!twoDaysPassed(userFind.streakTime, Date.now()) && !userFind.gotStreak) {
                const newStreak = userFind.streak + 1
                await users.updateOne({ _id: userFind._id }, {
                    $set: {
                        streak: newStreak,
                        gotStreak: true,
                        streakTime: time.getTime()
                    }
                })

                streak++
            }

            return res.send({
                ...addCoins,
                coins: newCoins,
                streak: streak
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

app.delete('/api/goals/delete/all', checkToken, async (req, res) => {
    try {
        const goalsDelete = goals.deleteMany({})
        return res.send(goalsDelete)
    } catch (err) {
        return res.send({
            error: err
        })
    }
})

app.get('/api/items/find/all', checkToken, async (req, res) => {
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
        const restaurant = await restaurants.findOne({ userId: userId })
        if (!restaurant) {
            return res.send({
                error: 'You do not own a restaurant'
            })
        }

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

            unownedItem.maxLevel = unownedItem.maxLevel[restaurant.level - 1]

            unownedItems.push(unownedItem)
        }

        return res.send(unownedItems)
    } catch (err) {
        console.log(err)
        return res.send({
            error: err
        })
    }
})

app.post('/api/items/user/find/all', checkToken, async (req, res) => {
    const userId = req.user.id
    const { friendId } = req.body
    const resultItems = []

    try {
        const restaurant = await restaurants.findOne({ userId: userId })
        if (!restaurant) {
            return res.send({
                error: 'You do not own a restaurant'
            })
        }

        const uItems = await userItems.find({ userId: friendId ? friendId : userId }).toArray()
        for (let i = 0; i < uItems.length; i++) {
            const item = await items.findOne({ _id: new ObjectId(uItems[i].itemId) })
            if (!item) {
                return res.send({
                    'error': 'That item does not exist'
                })
            }

            item.level = uItems[i].level

            const maxList = item.maxLevel
            const restaurantMax = item.maxLevel[restaurant.level - 1]
            item.maxLevel = restaurantMax
            item.unlockedFullMax = restaurantMax === maxList[maxList.length - 1]

            resultItems.push(item)
        }

        return res.send(resultItems)
    } catch (err) {
        console.log(err)
        return res.send({
            error: err
        })
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

app.post('/api/items/add', checkToken, async (req, res) => {
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
        const uItemCheck = await userItems.find({ userId: userId, itemId: itemId }).toArray()
        if (uItemCheck.length > 0) {
            return res.send({
                error: 'You already own this item'
            })
        }

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

        const restaurant = await restaurants.findOne({ userId: userId })
        if (!restaurant) {
            return res.send({
                error: 'This person does not own a restaurant'
            })
        }

        const featureMap = new Map()

        const features = [...item.features, ...restaurant.stats]
        const removeDollar = str => parseInt(str.replace(/[^0-9.-]/g, ''))

        features.forEach(item => {
            const feature = item.feature
            const ending = item.ending
            let amount;

            if (feature === 'Average profit') {
                amount = removeDollar(item.amount)
            } else {
                amount = parseInt(item.amount)
            }

            if (featureMap.has(feature)) {
                const prev = featureMap.get(feature)

                featureMap.set(feature, {
                    feature,
                    amount: prev.amount + amount,
                    ending
                })
            } else {
                featureMap.set(feature, {
                    feature,
                    amount,
                    ending
                })
            }
        })

        const endStats = Array.from(featureMap.values()).map(item => ({
            ...item,
            amount: item.feature === 'Average profit' ? `$${item.amount}` : item.amount.toString()
        }))

        await restaurants.updateOne(restaurant, {
            $set: {
                stats: endStats
            }
        })

        if (isNewDay(user.streakTime, time.getTime()) && user.gotStreak) {
            await users.updateOne({ _id: user._id }, {
                $set: {
                    gotStreak: false
                }
            })
            
            user.gotStreak = false
            
        }
       
        const newItemDoc = { 
            userId: userId, 
            itemId: itemId,
            level: 1,
            boughtAt: `${time.toLocaleDateString()} ${time.toLocaleTimeString()}` 
        }
        const newItem = await userItems.insertOne(newItemDoc)

        await users.updateOne(user, {
            $set: {
                coins: newCoins
            }
        })

        let streak = user.streak

        if (twoDaysPassed(user.streakTime, time.getTime()) && !user.gotStreak) {
            await users.updateOne({ _id: user._id }, {
                $set: {
                    streak: 1,
                    gotStreak: true,
                    streakTime: time.getTime()
                }
            })

            streak = 1
        } else if (!twoDaysPassed(user.streakTime, time.getTime()) && !user.gotStreak) {
            await users.updateOne({ _id: user._id }, {
                $set: {
                    streak: user.streak + 1,
                    gotStreak: true,
                    streakTime: time.getDate()
                }
            })

            streak++
        }

        return res.send({
            ...newItem,
            coins: newCoins,
            streak: streak,
            endStats: endStats
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

        const restaurant = await restaurants.findOne({ userId: userId })
        if (!restaurant) {
            return res.send({
                error: 'You do not own a restaurant'
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

        const itemFeatures = new Map(item.features.map(feature => [feature.feature, feature]))

        const removeDollar = str => parseInt(str.replace(/[^0-9.-]/g, ''))

        const restaurantUpdatedStats = restaurant.stats.map(feature => {
            const featureToRemove = itemFeatures.get(feature.feature)

            if (featureToRemove) {

                const trueAmount = (str, isDollar) => isDollar 
                    ? removeDollar(str) + (removeDollar(str) * (uItem.level - 1) * 1.5)
                    : parseInt(str) + (parseInt(str) * (uItem.level - 1) * 1.5)

                let dollar = false
                let dollarAmount;

                if (feature.feature === 'Average profit') {
                    dollar = true
                    dollarAmount = removeDollar(feature.amount) - trueAmount(feature.amount, true)
                }

                return {
                    ...feature,
                    amount: 
                        dollar 
                        ? `$${dollarAmount}` 
                        : Math.max(0, parseInt(feature.amount) - trueAmount(feature.amount, false)).toString()
                }
            }
            return feature
        })

        await userItems.deleteOne(uItem)
        await restaurants.updateOne(restaurant, {
            $set: {
                stats: restaurantUpdatedStats
            }
        })

        const newCoins = user.coins + (item.price * uItem.level)
        await users.updateOne(user, {
            $set: {
                coins: newCoins
            }
        })

        const now = Date.now()

        if (isNewDay(user.streakTime, now) && user.gotStreak) {
            await users.updateOne(user, {
                $set: {
                    gotStreak: false
                }
            })
            user.gotStreak = false
        }

        let streak;

        if (!twoDaysPassed(user.streakTime, now) && !user.gotStreak) {
            const newStreak = user.streak + 1
            await users.updateOne({ _id: user._id }, {
                $set: {
                    streak: newStreak,
                    streakTime: now,
                    gotStreak: true
                }
            })

            streak = newStreak
        } else if (twoDaysPassed(user.streakTime, now) && !user.gotStreak) {
            await users.updateOne({ _id: user._id }, {
                streak: 1,
                streakTime: now,
                gotStreak: true
            })

            streak = 1
        }

        return res.send({
            coins: newCoins,
            updatedStats: restaurantUpdatedStats,
            streak: streak
        })
    } catch (err) {
        console.log(err)
        return res.send({
            error: err
        })
    }
})

app.patch('/api/items/user/upgrade/', checkToken, async (req, res) => {
    const userId = req.user.id
    const { itemId } = req.body

    try {
        const time = Date.now()

        const userItemFind = await userItems.findOne({ itemId: itemId, userId: userId })
        if (!userItemFind) {
            return res.send({
                error: "You don't own this item or it doesn't exist"
            })
        }

        const restaurant = await restaurants.findOne({ userId: userId })
        if (!restaurant) {
            return res.send({
                error: 'You do not own a restaurant'
            })
        }

        const item = await items.findOne({ _id: new ObjectId(itemId) })

        const newLevel = userItemFind.level + 1
        
        const currentMaxLevel = item.maxLevel[restaurant.level - 1]

        if (currentMaxLevel >= newLevel) {
            const userFind = await users.findOne({ _id: new ObjectId(userId) })
            if (!userFind) {
                return res.send({
                    error: 'The user does not exist',
                    userNotExist: true
                })
            }

            if (isNewDay(userFind.streakTime, time) && userFind.gotStreak) {
                await users.updateOne({ _id: userFind._id }, {
                    $set: {
                        gotStreak: false
                    }
                })
                userFind.gotStreak = false
            }

            if (userFind.coins < item.price * (newLevel)) {
                return res.send({
                    error: 'You do not have enough coins'
                })
            }

            const newCoins = userFind.coins - (item.price * (newLevel))
            await users.updateOne(userFind, {
                $set: {
                    coins: newCoins
                }
            })

            await userItems.updateOne(userItemFind, {
                $set: {
                    level: newLevel
                }
            })

            const itemFeatures = new Map(item.features.map(feature => [feature.feature, feature]))
            const restaurantStats = restaurant.stats

            const removeDollar = str => parseInt(str.replace(/[^0-9.-]/g, ''))

            const newStats = restaurantStats.map(stat => {
                const feature = itemFeatures.get(stat.feature)
                
                if (feature) {
                    let dollar = false

                    if (stat.feature === 'Average profit') dollar = true

                    return {
                        ...stat,
                        amount: dollar
                            ? `$${removeDollar(stat.amount) + (removeDollar(stat.amount) * (newLevel - 1) * 1.5)}`
                            : (parseInt(stat.amount) + (parseInt(stat.amount) * (newLevel - 1) * 1.5)).toString()
                    }
                }

                return stat
            })

            await restaurants.updateOne({ _id: restaurant._id }, {
                $set: {
                    stats: newStats
                }
            })
            
            let streak = userFind.streak
            if (twoDaysPassed(userFind.streakTime, time) && !userFind.gotStreak) {
                await users.updateOne({ _id: userFind._id }, {
                    $set: {
                        streak: 1,
                        gotStreak: true,
                        streakTime: time
                    }
                })

                streak = 1
            } else if (!twoDaysPassed(userFind.streakTime, time) && !userFind.gotStreak) {
                const newStreak = userFind.streak + 1
                await users.updateOne({ _id: userFind._id }, {
                    $set: {
                        streak: newStreak,
                        gotStreak: true,
                        streakTime: time
                    }
                })

                streak++
            }

            const newItem = await items.findOne({ _id: new ObjectId(itemId) })
            const arrayMax = newItem.maxLevel
            newItem.maxLevel = arrayMax[restaurant.level - 1]
            newItem.unlockedFullMax = newItem.maxLevel === arrayMax[arrayMax.length - 1]
            newItem.level = newLevel

            return res.send({
                coins: newCoins,
                newItem: newItem,
                streak: streak,
                restaurantStats: newStats
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

app.get('/api/social/find/accepted', checkToken, async (req, res) => {
    const userId = req.user.id

    try {
        const userFind = await friends.find({ userId: userId, accepted: true }).toArray()
        const friendFind = await friends.find({ friendId: userId, accepted: true }).toArray()

        const fullFriends = []

        if (userFind.length === 0 && friendFind.length === 0) {
            return res.send([])
        }

        if (userFind.length > 0) {
            for (let i = 0; i < userFind.length; i++) {
                const user = await users.findOne(
                    { _id: new ObjectId(userFind[i].friendId) }, 
                    { projection: { password: 0 } }
                )
                if (!user) {
                    return res.send({
                        error: 'User in friends does not exist'
                    })
                }

                fullFriends.push(user)
            }
        }

        if (friendFind.length > 0) {
            for (let j = 0; j < friendFind.length; j++) {
                const friend = await users.findOne(
                    { _id: new ObjectId(friendFind[j].userId) },
                    { projection: { password: 0 } }
                )
                if (!friend) {
                    return res.send({
                        error: 'Friend in users does not exist'
                    })
                }

                fullFriends.push(friend)
            }
        }

        return res.send(fullFriends)
    } catch (err) {
        console.log(`All Friends Find Error: ${err}`)
        return res.send({
            error: err
        })
    }
})

app.get("/api/social/find/requested", checkToken, async (req, res) => {
    const userId = req.user.id

    const friendFind = await friends.find({ friendId: userId, accepted: false }).toArray()
    if (!friendFind) {
        return res.send({
            error: 'No new friend requests'
        })
    }

    const userResults = []

    for (let i = 0; i < friendFind.length; i++) {
        const userFind = await users.findOne(
            { _id: new ObjectId(friendFind[i].userId) },
            { projection: { password: 0 } }
        )
        if (!userFind) {
            return res.send({
                error: 'User who sent request could not be found'
            })
        }

        userResults.push(userFind)
    }

    return res.send(userResults)
})

app.post('/api/social/add', checkToken, async (req, res) => {
    const userId = req.user.id
    const { friendId } = req.body

    try {
        if (userId === friendId) {
            return res.send({
                error: 'You cannot become friends with yourself'
            })
        }

        const userFindCheck = await users.findOne({ _id: new ObjectId(userId) })
        if (!userFindCheck) {
            return res.send({
                error: 'User does not exist'
            })
        }

        const friendFindCheck = await users.findOne({ _id: new ObjectId(friendId) })
        if (!friendFindCheck) {
            return res.send({
                error: 'Friend does not exist'
            })
        }

        const time = new Date()
        const newFriendDoc = {
            userId: userId,
            friendId: friendId,
            accepted: false,
            createdAt: `${time.toLocaleDateString()} ${time.toLocaleTimeString()}`
        }

        const newFriend = await friends.insertOne(newFriendDoc)

        return res.send(newFriend)
    } catch (err) {
        console.log(`One New Friend Error: ${err}`)
        return res.send({
            error: err
        })
    }
})

app.patch('/api/social/accept', checkToken, async (req, res) => {
    const userId = req.user.id
    const { friendId } = req.body

    const userFindCheck = await users.findOne({ _id: new ObjectId(userId) })
    const friendFindCheck = await users.findOne({ _id: new ObjectId(friendId) })

    if (!userFindCheck || !friendFindCheck) {
        return res.send({
            error: 'User or friend not found'
        })
    }

    const sendRequestCheck = await friends.findOne({ userId: friendId, friendId: userId })
    if (!sendRequestCheck) {
        return res.send({
            error: 'You never sent a request to this person'
        })
    }

    const acceptRequest = await friends.updateOne(sendRequestCheck, {
        $set: {
            accepted: true
        }
    })

    return res.send(acceptRequest)
})

app.delete('/api/social/remove', checkToken, async (req, res) => {
    const userId = req.user.id
    const { friendId } = req.body

    try {
        if (userId === friendId) {
            return res.send({
                error: 'You cannot remove yourself as a friend'
            })
        }

        const userFindCheck = await users.findOne({ _id: new ObjectId(userId) })
        if (!userFindCheck) {
            return res.send({
                error: 'User does not exist'
            })
        }

        const friendFindCheck = await users.findOne({ _id: new ObjectId(friendId) })
        if (!friendFindCheck) {
            return res.send({
                error: 'Friend does not exist'
            })
        }

        const friendDelete = await friends.deleteOne({ userId: userId, friendId: friendId })
        if (friendDelete.deletedCount === 0) {
            const userFriendDelete = await friends.deleteOne({ userId: friendId, friendId: userId })
            if (userFriendDelete.deletedCount === 0) {
                return res.send({
                    error: 'Friend could not be removed. Please try again later'
                })
            } else {
                return res.send(userFriendDelete)
            }
        } else {
            return res.send(friendDelete)
        }
    } catch (err) {
        console.log(`One Friend Remove Error: ${err}`)
        return res.send({
            error: err
        })
    }
})

app.get('/api/restaurants/find/stats', checkToken, async (req, res) => {
    const userId = req.user.id

    try {
        const restaurant = await restaurants.findOne({ userId: userId })
        if (!restaurant) {
            return res.send({
                error: 'You do not own a restaurant'
            })
        }

        const imageLevel = parseInt(restaurant.level) - 1
        return res.send({
            ...restaurant,
            images: restaurant.images[imageLevel]
        })
    } catch (err) {
        console.log(`All Restaurant Stats Find Error: ${err}`)
        return res.send({
            error: err
        })
    }
})

app.patch('/api/restaurants/upgrade', checkToken, async (req, res) => {
    const userId = req.user.id

    try {
        const user = await users.findOne({ _id: new ObjectId(userId) })
        if (!user) {
            return res.send({
                error: 'The user does not exist',
                userNotExist: true
            })
        }

        const restaurant = await restaurants.findOne({ userId: userId })
        if (!restaurant) {
            return res.send({
                error: 'You do not own a restaurant'
            })
        }

        const newLevel = restaurant.level + 1
        if (user.coins < (220 * newLevel)) {
            return res.send({
                error: 'You do not have enough coins'
            })
        }

        await restaurants.updateOne(restaurant, {
            $set: {
                level: newLevel
            }
        })
        restaurant.level = newLevel

        const ownedItemIds = await userItems.find({ userId: userId }).project({ itemId: 1 }).toArray()
        const ownedItems = []

        for (let i = 0; i < ownedItemIds.length; i++) {
            const id = ownedItemIds[i].itemId

            const item = await items.findOne(
                { _id: new ObjectId(id) },
                { projection: { _id: 1, maxLevel: 1 } }
            )

            const arrayMax = item.maxLevel
            item.maxLevel = item.maxLevel[restaurant.level - 1]
            item.unlockedFullMax = item.maxLevel === arrayMax[arrayMax.length - 1]

            ownedItems.push(item)
        }

        const newCoins = user.coins - (220 * newLevel)
        await users.updateOne({ _id: user._id }, {
            $set: {
                coins: newCoins
            }
        })

        return res.send({
            coins: newCoins,
            level: newLevel,
            newItems: ownedItems
        })
    } catch (err) {
        console.log(`Restaurant Upgrade Error: ${err}`)
        return res.send({
            error: err
        })
    }
})

app.listen(port, (err) => {
    if (err) console.log(`Server error: ${err}`)
    console.log(`Server running on port ${port}`)
})