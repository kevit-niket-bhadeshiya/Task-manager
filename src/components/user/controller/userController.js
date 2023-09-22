const User = require('../models/user')
const sharp = require('sharp')
const { sendWelcomeEmail, sendCancellationEmail } = require('../../../email/account')


// function to create user
exports.createUser = async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

// function to login user
exports.userLogin = async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken()
        res.send({ user, token });
    } catch (error) {
        console.log(error);
        res.status(400).send(error.message)
    }
}

// function to read all users from db
exports.readUsers = async (req, res) => {
    try {
        const usersData = await User.find();
        res.status(201).send(usersData);
    } catch (error) {
        res.status(500).send(error);
    }
}

// function to user logout
exports.userLogout = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
}

// function to logout user from all devices they login
exports.userLogoutFromAll = async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
}

// function to read user data
exports.readUser = async (req, res) => {
    res.send(req.user);
}

// function to update user
exports.updateUser = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((item) => allowedUpdates.includes(item));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Updates!' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])

        await req.user.save();

        res.send(req.user);
    } catch (error) {
        res.status(400).send(error)
    }
}

// function to delete user
exports.deleteUser = async (req, res) => {
    try {
        await User.findOneAndDelete({ _id: req.user._id })
        sendCancellationEmail(req.user.email, req.user.name);
        res.send(req.user)
    } catch (error) {
        res.status(400).send(error.message);
    }
}

// function to add or update user avatar 
exports.uploadAvatar = async (req, res) => {
    try {
        const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
        req.user.avatar = buffer
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(400).send({ error : error.message})
    }

}

// function to handle upload avatar error 
exports.handleUploadAvatar = (error, req, res, next) => {
    res.status(400).send({ error: error.message })
}

// function to delete avatar of user 
exports.deleteAvatar = async (req, res) => {
    try {
        req.user.avatar = undefined
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(404).send()
    }
}

// function to get avatar of user 
exports.readAvatar = async(req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if(!user?.avatar){
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)

    } catch (error) {
        res.status(404).send()
    }
}