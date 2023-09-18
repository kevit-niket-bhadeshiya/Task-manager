const express = require('express');
const auth = require('../../../middleware/auth')
const controller = require('../controller/userController')

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

// for delete user
router.delete('/users/me', auth, controller.deleteUser)

module.exports = router;