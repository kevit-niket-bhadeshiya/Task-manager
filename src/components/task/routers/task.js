const express = require('express');
const auth = require('../../../middleware/auth');
const controller = require('../controller/taskController')

const router = new express.Router();

// for create task
router.post('/tasks', auth, controller.createTask)

// for read tasks of user
router.get('/tasks', auth, controller.readTask)

// for read specific task
router.get('/tasks/:id', auth, controller.readTaskById)

// for update task
router.patch('/tasks/:id', auth, controller.updateTask)

// for delete task
router.delete('/tasks/:id', auth, controller.deleteTask)

module.exports = router;