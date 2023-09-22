const jwt = require('jsonwebtoken');
const User = require('../components/user/models/user');

const auth = async(req, res, next) => {
    try {
        // console.log();
        const token = req.header('Authorization').replace('Bearer ', '')
        // console.log(token);

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