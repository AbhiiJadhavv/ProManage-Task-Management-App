import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    }],
    title: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        enum: ['high', 'moderate', 'low'],
        required: true
    },
    checklistItems: [
        {
            text: {
                type: String,
                required: true
            },
            completed: {
                type: Boolean,
                default: false
            }
        }
    ],
    dueDate: {
        type: Date,
        required: false
    },
    status: {
        type: String,
        enum: ['toDo', 'backlog', 'inProgress', 'done'],
        default: 'toDo'
    }
}, { timestamps: true });

export const Task = mongoose.model('Task', taskSchema);