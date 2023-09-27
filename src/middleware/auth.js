const jwt = require('jsonwebtoken');
const User = require('../components/user/models/user');

/**
 * Middleware function to validate user
 * @param {object} req.header.required - to get token and verify user
 * @param {Function} next - to continue execution after authenticate user
 * @returns {object} 401 - Unauthorized
 */

const auth = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if(!user) {
            throw new Error()
        }

        req.token = token;
        req.user = user;
        next();

    } catch (error) {
        res.status(401).send({ error: "Please Authenticate" })
    }
}

module.exports = auth;