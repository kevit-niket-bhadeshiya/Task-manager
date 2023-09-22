const express = require('express');
const multer = require('multer');
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

// for add or update user avatar
router.post('/users/me/avatar', auth, upload.single('avatar'), controller.uploadAvatar, controller.handleUploadAvatar)

// to delete user avatar
router.delete('/users/me/avatar', auth, controller.deleteAvatar)

// to get user avatar
router.get('/users/:id/avatar', controller.readAvatar)

// for delete user
router.delete('/users/me', auth, controller.deleteUser)

module.exports = router;