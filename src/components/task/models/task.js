const mongoose = require('mongoose');

// created model for task
const Task = mongoose.model('Task', {
    description: {
        type: String,
        required: true,
        trim: true 
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

module.exports = Task;