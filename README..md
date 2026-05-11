A full-stack Team Task Manager web application built with React, Node.js, Express, and MongoDB.

Features
User Authentication: Secure signup and login with JWT and bcrypt.
Role-Based Access: Admin and Member roles with different permissions.
Dashboard: Overview of projects, tasks, and team progress.
Project Management: Create, edit, and delete projects.
Task Management: Assign tasks, set priorities, and track status.
Team Management: Add/remove team members (Admin only).
Responsive Design: Modern UI that works on desktop and mobile.
Tech Stack
Frontend: React, Vite, Tailwind CSS, Axios, Lucide React, React Hot Toast.
Backend: Node.js, Express, MongoDB (Mongoose), JWT, Bcrypt.
Local Setup
1. Prerequisites
Node.js installed
MongoDB Atlas account (for database)
2. Backend Setup
cd backend
npm install
Create a .env file and add your MONGODB_URI and JWT_SECRET.
npm run dev
3. Frontend Setup
cd frontend
npm install
npm run dev
Deployment Instructions
Backend (Railway)
Connect your GitHub repository to Railway.
Add your environment variables (MONGODB_URI, JWT_SECRET, etc.) in the Railway dashboard.
Railway will automatically detect the package.json and start the server.
Frontend (Vercel)
Connect your GitHub repository to Vercel.
Set the "Build Command" to npm run build.
Set the "Output Directory" to dist.
Add the VITE_API_URL environment variable pointing to your Railway backend URL.
Folder Structure
/backend: Express server, models, controllers, and routes.
/frontend: React application with Vite and Tailwind CSS.
