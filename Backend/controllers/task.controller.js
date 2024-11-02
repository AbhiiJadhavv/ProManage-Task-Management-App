import { Task } from '../models/task.model.js';
import { User } from '../models/user.model.js';

export const createTask = async (req, res) => {
    try {
        const { title, priority, assignTo, checklistItems, dueDate } = req.body;
        const creatorEmail = req.user ? req.user.email : req.body.creatorEmail;

        const creator = await User.findOne({ email: creatorEmail });
        if (!creator) {
            return res.status(400).json({ error: "Creator user not found" });
        }

        const users = [creator._id];

        if (assignTo && assignTo !== creatorEmail) {
            const assignee = await User.findOne({ email: assignTo });
            if (!assignee) {
                return res.status(400).json({ error: "Assignee user not found" });
            }
            users.push(assignee._id);
        }

        const newTask = new Task({
            users,
            title,
            priority,
            checklistItems,
            dueDate,
            status: 'toDo' 
        });

        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


export const getTasksByUser = async (req, res) => {
    try {
        const userId = req.query.userId || req.user._id;

        const tasks = await Task.find({ users: userId });
        res.status(200).json({ tasks });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


export const updateTaskStatus = async (req, res) => {
    const { taskId } = req.params;
    const { status } = req.body;

    if (!['toDo', 'backlog', 'inProgress', 'done'].includes(status)) {
        return res.status(400).json({
            message: 'Invalid status',
            success: false,
        });
    }

    try {
        const updatedTask = await Task.findByIdAndUpdate(taskId, { status }, { new: true });

        return res.status(201).json({
            message: 'Task status updated successfully.',
            success: true,
            data: updatedTask,
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            message: error.message,
            success: false,
        });
    }
};


export const updateTask = async (req, res) => {
    const { taskId } = req.params;
    const { title, priority, assignTo, checklistItems, dueDate } = req.body;

    try {
        const task = await Task.findById(taskId).populate('users');
        if (!task) return res.status(404).json({ error: "Task not found" });

        const creator = task.users[0]; 
        const users = [creator._id];

        if (assignTo && assignTo !== creator.email) {
            const assignee = await User.findOne({ email: assignTo });
            if (!assignee) {
                return res.status(400).json({ error: "Assignee user not found" });
            }
            users.push(assignee._id);
        }

        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            {
                title,
                priority,
                checklistItems,
                dueDate,
                users 
            },
            { new: true }
        );

        return res.status(200).json(updatedTask);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: error.message });
    }
};


export const deleteTask = async (req, res) => {
    const { taskId } = req.params;

    try {
        await Task.findByIdAndDelete(taskId);
        return res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: error.message });
    }
};


export const addUserToTasks = async (req, res) => {
    const { currentUserId, newUserEmail } = req.body;

    if (!currentUserId || !newUserEmail) {
        return res.status(400).json({ message: "User ID and email are required." });
    }

    try {
        const newUser = await User.findOne({ email: newUserEmail });
        if (!newUser) {
            return res.status(404).json({ message: "User with this email not found." });
        }

        const tasks = await Task.updateMany(
            { users: currentUserId },
            { $addToSet: { users: newUser._id } } 
        );

        res.status(200).json({ message: "User added to tasks successfully.", tasks });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const toggleChecklistItemCompletion = async (req, res) => {
    const { taskId } = req.params;
    const { index } = req.body; 

    try {
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        if (index < 0 || index >= task.checklistItems.length) {
            return res.status(400).json({ error: "Checklist item index out of range" });
        }

        task.checklistItems[index].completed = !task.checklistItems[index].completed;

        await task.save();
        res.status(200).json({ message: "Checklist item updated successfully", task });
    } catch (error) {
        console.error("Failed to toggle checklist item:", error);
        res.status(500).json({ error: error.message });
    }
};


export const getTaskByIdReadOnly = async (req, res) => {
    const { taskId } = req.params;

    try {
        const task = await Task.findById(taskId).select('title priority checklistItems dueDate status');
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.status(200).json(task); 
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching the task" });
    }
};
