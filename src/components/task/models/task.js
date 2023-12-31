const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
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
}, {
    timestamps: true
})

// created model for task
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;