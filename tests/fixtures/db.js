const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/components/user/models/user')
const Task = require('../../src/components/task/models/task')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: "Mike",
    email: "mike@example.com",
    password: "56what!!",
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: "Jess",
    email: "jess@example.com",
    password: "myhouse@990",
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id:new mongoose.Types.ObjectId(),
    description: "First task",
    completed: false,
    owner: userOne._id
}

const taskTwo = {
    _id:new mongoose.Types.ObjectId(),
    description: "second task",
    completed: false,
    owner: userOne._id
}

const taskThree = {
    _id:new mongoose.Types.ObjectId(),
    description: "third task",
    completed: false,
    owner: userTwo._id
}

const setupDatabase = async() => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    userOneId,
    userTwoId,
    userOne,
    userTwo,
    taskOne,
    taskThree,
    taskTwo,
    setupDatabase
}