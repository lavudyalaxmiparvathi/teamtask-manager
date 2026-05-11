const User = require('../models/User');

// @desc    Get all team members
// @route   GET /api/team
// @access  Private
exports.getTeamMembers = async (req, res) => {
    try {
        const members = await User.find().select('-password');
        res.status(200).json({ success: true, count: members.length, data: members });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Add team member (Admin only)
// @route   POST /api/team
// @access  Private/Admin
exports.addMember = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'Member'
        });

        res.status(201).json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Delete team member (Admin only)
// @route   DELETE /api/team/:id
// @access  Private/Admin
exports.deleteMember = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        await user.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
