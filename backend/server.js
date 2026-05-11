const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// MongoDB Connection
const connectDB = async () => {
    try {
        if (process.env.USE_MOCK_DB === 'true') {
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongoServer = await MongoMemoryServer.create();
            const uri = mongoServer.getUri();
            await mongoose.connect(uri);
            console.log('Using Mock In-Memory Database');
            
            // Seed Sample Data
            await seedMockData();
        } else {
            await mongoose.connect(process.env.MONGODB_URI);
            console.log('MongoDB Connected Successfully');
        }
    } catch (err) {
        console.error('MongoDB Connection Error:', err.message);
        process.exit(1);
    }
};

const seedMockData = async () => {
    try {
        const User = require('./models/User');
        const Project = require('./models/Project');
        const Task = require('./models/Task');

        // Create a default admin
        const admin = await User.create({
            name: 'Test Admin',
            email: 'admin@example.com',
            password: 'password123',
            role: 'Admin'
        });

        // Create a project
        const project = await Project.create({
            name: 'Website Redesign',
            description: 'Modernizing the company landing page',
            team: [admin._id],
            owner: admin._id,
            status: 'Active'
        });

        // Create tasks
        await Task.create([
            {
                title: 'Design Hero Section',
                description: 'Create a high-fidelity mockup',
                project: project._id,
                assignedTo: admin._id,
                createdBy: admin._id,
                priority: 'High',
                status: 'Completed',
                dueDate: new Date(Date.now() + 86400000 * 2)
            },
            {
                title: 'Develop API Endpoints',
                description: 'Implement auth and task routes',
                project: project._id,
                assignedTo: admin._id,
                createdBy: admin._id,
                priority: 'Medium',
                status: 'In Progress',
                dueDate: new Date(Date.now() + 86400000 * 5)
            },
            {
                title: 'Quality Assurance',
                description: 'Test all components for responsiveness',
                project: project._id,
                assignedTo: admin._id,
                createdBy: admin._id,
                priority: 'Low',
                status: 'Pending',
                dueDate: new Date(Date.now() + 86400000 * 10)
            },
            {
                title: 'Deployment Prep',
                description: 'Finalize server configuration',
                project: project._id,
                assignedTo: admin._id,
                createdBy: admin._id,
                priority: 'High',
                status: 'Pending',
                dueDate: new Date(Date.now() - 86400000 * 1) // Overdue
            }
        ]);

        console.log('✅ Mock Data Seeded Successfully');
        console.log('Credentials: admin@example.com / password123');
    } catch (error) {
        console.error('Seeding Error:', error);
    }
};

connectDB();

// Root route
app.get('/', (req, res) => {
    console.log('Root route hit');
    res.json({ message: 'Welcome to Team Task Manager API' });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/team', require('./routes/team'));

// Error Handler Middleware
app.use(require('./middleware/error'));


// Port configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
