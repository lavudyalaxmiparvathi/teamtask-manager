const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a project name'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    status: {
        type: String,
        enum: ['Active', 'Completed', 'On Hold'],
        default: 'Active'
    },
    team: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
