const jwt = require('jsonwebtoken');
const User = require('../components/user/models/user');

const checkAuth = async (req, res, next) => {
    try {
        const user = await User.findOne({ name: req.body.name });
        if(user){
            throw new Error('Already exist..!!')
        }
        next();
    } catch (error) {
        res.status(400).send(error.message)
    }
}

module.exports = checkAuth