const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true
    },
    targetType: {
        type: String,
        enum: ['Project', 'Task', 'User'],
        required: true
    },
    targetId: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    details: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);
