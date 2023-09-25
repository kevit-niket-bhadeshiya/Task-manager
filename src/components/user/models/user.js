const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('../../../components/task/models/task')

// created schema of user
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minLength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('it should not contain "password"')
            }
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid..')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error("Age must be a positive number")
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar : {
        type: Buffer
    }
} , {
    timestamps: true
})


// add virtual to get tasks of user with user data.
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

// define toJSON for remove unnecessary data to send
userSchema.methods.toJSON = function () {  // it will call internally by JSON.stringify(). we don't need to call it.
    const user = this
    const userObject = user.toObject();  // it is used to convert mongoose document to an object.

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject;
}

// function to generate authentication token & save with user data.
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save();

    return token;
}

// function to validate email and password at login of user
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user;
}

// added pre hook to Hash the plain text password.
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next();
})

// Delete all user's tasks when user is removed
userSchema.post('findOneAndDelete', async function(user){
    await Task.deleteMany({ owner: user._id })
})

// created model from schema
const User = mongoose.model('User', userSchema)

module.exports = User;