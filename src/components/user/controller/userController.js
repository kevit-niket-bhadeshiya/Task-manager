const User = require('../models/user')
const sharp = require('sharp')
const { sendWelcomeEmail, sendCancellationEmail } = require('../../../email/account')


/**
 * Create user
 * @param {User} req.body.required - user info
 * @returns {object} 200 - success response - sends newly created user and it's token
 * @returns {object} 400 - Bad request response
 */
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

/**
 * Login user
 * @param {object} req.body.required - to login user 
 * @returns {object} 200 - success response - sends user info and it's new token
 * @returns {object} 400 - Bad request response
 */
exports.userLogin = async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken()
        res.send({ user, token });
    } catch (error) {
        res.status(400).send({error})
    }
}

/**
 * Read all users 
 * @param {object} req 
 * @returns {Array of Object} 200 - success response - sends all users
 * @returns {object} 500 - internal server error
 */
exports.readUsers = async (req, res) => {
    try {
        const usersData = await User.find();
        res.status(201).send(usersData);
    } catch (error) {
        res.status(500).send({error});
    }
}

/**
 * Logout user
 * @param {object} req.user.required - generated from middleware auth
 * @returns {null} 200 - success response 
 * @returns {null} 500 - internal server error
 */
exports.userLogout = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
}

/**
 * Logout user from all devices they login
 * @param {object} req.user.required - generated from middleware auth
 * @returns {null} 200 - success response
 * @returns {null} 500 - internal server error 
 */
exports.userLogoutFromAll = async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
}

/**
 * Read user data
 * @param {object} req.user.required - generated from middleware auth
 * @param {User} 200 - success response - sends user's data
 */
exports.readUser = async (req, res) => {
    res.send(req.user);
}

/**
 * Update user
 * @param {object} req.body.required - user info to be updated.
 * @returns {User} 200 - success response - newly updated data of user
 * @returns {object} 400 - Bad request response - invalid updates
 */
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
        res.status(400).send({error})
    }
}

/**
 * Delete user
 * @param {object} req.user.required - user info to be deleted generated from middleware auth
 * @param {User} 200 - success response - deleted user data
 * @param {object} 400 - Bad request response
 */
exports.deleteUser = async (req, res) => {
    try {
        await User.findOneAndDelete({ _id: req.user._id })
        sendCancellationEmail(req.user.email, req.user.name);
        res.send(req.user)
    } catch (error) {
        res.status(400).send({error});
    }
}

/**
 * Add or update user avatar 
 * @param {object} req.file - file to be added or updated 
 * @param {object} req.user.required - generated from auth middleware
 * @returns {null} 200 - success response 
 * @returns {object} 400 - Bad request response 
 */
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

/**
 * Handle upload avatar error 
 */
exports.handleUploadAvatar = (error, req, res, next) => {
    res.status(400).send({ error: error.message })
}

/**
 * Delete avatar of user 
 * @param {object} req.user.required - generated from middleware auth
 * @returns {null} 200 - success response 
 * @returns {object} 500 - internal server error
 */
exports.deleteAvatar = async (req, res) => {
    try {
        req.user.avatar = undefined
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error.message)
    }
}

/**
 * Get avatar of user 
 * @param {object} req.user.required - generated from auth middleware 
 * @returns {Buffer} 200 - success response - image/png
 * @returns {null} 404 - Not found
 */
exports.readAvatar = async(req, res) => {
    try {
        console.log(req.user);
        // const user = await User.findById(req.params.id);

        if(!req.user?.avatar){
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(req.user.avatar)

    } catch (error) {
        res.status(404).send()
    }
}