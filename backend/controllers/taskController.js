const Task = require('../models/Task');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res) => {
    try {
        let query;

        // Filter by project if project ID is provided
        if (req.query.projectId) {
            query = Task.find({ project: req.query.projectId });
        } else if (req.user.role !== 'Admin') {
            // Non-admins see tasks assigned to them
            query = Task.find({ assignedTo: req.user.id });
        } else {
            query = Task.find();
        }

        const tasks = await query
            .populate('project', 'name')
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name');

        res.status(200).json({ success: true, count: tasks.length, data: tasks });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res) => {
    try {
        req.body.createdBy = req.user.id;

        const task = await Task.create(req.body);

        // Log activity
        await ActivityLog.create({
            user: req.user.id,
            action: 'CREATED_TASK',
            targetType: 'Task',
            targetId: task._id,
            details: `Task "${task.title}" created`
        });

        res.status(201).json({ success: true, data: task });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        // Only creator, assigned user, or admin can update
        if (
            task.createdBy.toString() !== req.user.id &&
            task.assignedTo.toString() !== req.user.id &&
            req.user.role !== 'Admin'
        ) {
            return res.status(401).json({ success: false, message: 'Not authorized to update this task' });
        }

        task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        // Log activity
        await ActivityLog.create({
            user: req.user.id,
            action: 'UPDATED_TASK',
            targetType: 'Task',
            targetId: task._id,
            details: `Task "${task.title}" updated`
        });

        res.status(200).json({ success: true, data: task });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        // Only creator or admin can delete
        if (task.createdBy.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(401).json({ success: false, message: 'Not authorized to delete this task' });
        }

        await task.deleteOne();

        // Log activity
        await ActivityLog.create({
            user: req.user.id,
            action: 'DELETED_TASK',
            targetType: 'Task',
            targetId: req.params.id,
            details: `Task "${task.title}" deleted`
        });

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get dashboard stats
// @route   GET /api/tasks/stats
// @access  Private
exports.getStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const isAdmin = req.user.role === 'Admin';

        const filter = isAdmin ? {} : { assignedTo: userId };

        const totalTasks = await Task.countDocuments(filter);
        const completedTasks = await Task.countDocuments({ ...filter, status: 'Completed' });
        const pendingTasks = await Task.countDocuments({ ...filter, status: 'Pending' });
        const inProgressTasks = await Task.countDocuments({ ...filter, status: 'In Progress' });
        
        // Overdue tasks (Due date passed and not completed)
        const overdueTasks = await Task.countDocuments({
            ...filter,
            status: { $ne: 'Completed' },
            dueDate: { $lt: new Date() }
        });

        const totalProjects = isAdmin 
            ? await require('../models/Project').countDocuments()
            : await require('../models/Project').countDocuments({ team: userId });

        res.status(200).json({
            success: true,
            data: {
                totalTasks,
                completedTasks,
                pendingTasks,
                inProgressTasks,
                overdueTasks,
                totalProjects
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
