const express = require('express');
const multer = require('multer');
const sharp = require('sharp')
const auth = require('../../../middleware/auth')
const controller = require('../controller/userController')
const User = require('../models/user');

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error("Please upload an image !"))
        }

        cb(undefined, true)
    }
}) 

const router = new express.Router()

// for create  user
router.post('/users', controller.createUser)

// for user login
router.post('/users/login', controller.userLogin)

// to read all user
router.get('/users', controller.readUsers)

// for user logout
router.post('/users/logout', auth, controller.userLogout)

// for user logout of all devices they loged-in
router.post('/users/logoutAll', auth, controller.userLogoutFromAll)

// to read user 
router.get('/users/me', auth, controller.readUser)

// for update user
router.patch('/users/me', auth, controller.updateUser)

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width:250, height:250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async(req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async(req, res) => {
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
})

// for delete user
router.delete('/users/me', auth, controller.deleteUser)

module.exports = router;