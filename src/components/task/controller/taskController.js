const Task = require('../models/task');

// function to create task
exports.createTask = async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        const result = await task.save();
        res.status(201).send(result);
    } catch (error) {
        res.status(400).send(error)
    }
}

// function to read tasks
// Get /tasks?completed=true
// Get /tasks?limit=10&skip=10
// Get /tasks?sortBy=createdAt:asc
exports.readTask = async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    // const query = {
    //     owner: req.user._id
    // }
    // const sort = {}

    // if (req.query.completed) {
    //     query.completed = req.query.completed === 'true'
    // }

    // if (req.query.sortBy) {
    //     const parts = req.query.sortBy.split(':')
    //     sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    // }

    // console.log(sort);

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                skip: parseInt(req.query.skip),
                limit: parseInt(req.query.limit),
                sort
            }
        });
        res.status(200).send(req.user.tasks);

        // const task = await Task.find(query).skip(req.query.skip).limit(req.query.limit).sort(sort)
        // res.status(200).send(task);

    } catch (error) {
        res.status(500).send(error);
    }
}

// function to read specific task of user
exports.readTaskById = async (req, res) => {
    const _id = req.params.id;

    try {
        const taskData = await Task.findOne({ _id, owner: req.user._id })

        if (!taskData) {
            return res.status(404).send()
        }

        res.send(taskData);
    } catch (error) {
        res.status(400).send(error);
    }
}

// function to update task 
exports.updateTask = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every((ele) => allowedUpdates.includes(ele));

    if (!isValidOperation) {
        return res.status(404).send({ error: 'Invalid Updates..!!' })
    }

    try {

        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

        // const updatedData = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!task) {
            return res.status(404).send();
        }

        updates.forEach((update) => task[update] = req.body[update])
        const updatedData = await task.save();

        res.send(updatedData);
    } catch (error) {
        res.status(400).send(error);
    }
}

// function to delete specific task
exports.deleteTask = async (req, res) => {
    try {
        const deletedData = await Task.findByIdAndDelete({ _id: req.params.id, owner: req.user._id });
        if (!deletedData) {
            return res.status(404).send();
        }
        res.send(deletedData);
    } catch (error) {
        res.status(400).send(error)
    }
}