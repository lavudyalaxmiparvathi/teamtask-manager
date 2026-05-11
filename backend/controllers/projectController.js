const Project = require('../models/Project');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res) => {
    try {
        let query;
        
        // If not admin, only show projects user is part of
        if (req.user.role !== 'Admin') {
            query = Project.find({ team: req.user.id });
        } else {
            query = Project.find();
        }

        const projects = await query.populate('owner', 'name email').populate('team', 'name email');
        res.status(200).json({ success: true, count: projects.length, data: projects });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
exports.getProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('owner', 'name email').populate('team', 'name email');

        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        res.status(200).json({ success: true, data: project });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Create project
// @route   POST /api/projects
// @access  Private (Admin only)
exports.createProject = async (req, res) => {
    try {
        req.body.owner = req.user.id;
        
        // Add owner to team by default
        if (!req.body.team) {
            req.body.team = [req.user.id];
        } else if (!req.body.team.includes(req.user.id)) {
            req.body.team.push(req.user.id);
        }

        const project = await Project.create(req.body);

        // Log activity
        await ActivityLog.create({
            user: req.user.id,
            action: 'CREATED_PROJECT',
            targetType: 'Project',
            targetId: project._id,
            details: `Project "${project.name}" created`
        });

        res.status(201).json({ success: true, data: project });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Admin only)
exports.updateProject = async (req, res) => {
    try {
        let project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        project = await Project.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        // Log activity
        await ActivityLog.create({
            user: req.user.id,
            action: 'UPDATED_PROJECT',
            targetType: 'Project',
            targetId: project._id,
            details: `Project "${project.name}" updated`
        });

        res.status(200).json({ success: true, data: project });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Admin only)
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        await project.deleteOne();

        // Log activity
        await ActivityLog.create({
            user: req.user.id,
            action: 'DELETED_PROJECT',
            targetType: 'Project',
            targetId: req.params.id,
            details: `Project "${project.name}" deleted`
        });

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
