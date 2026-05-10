# Team Task Manager

A full-stack Team Task Manager web application built with React, Node.js, Express, and MongoDB.

## Features
- **User Authentication**: Secure signup and login with JWT and bcrypt.
- **Role-Based Access**: Admin and Member roles with different permissions.
- **Dashboard**: Overview of projects, tasks, and team progress.
- **Project Management**: Create, edit, and delete projects.
- **Task Management**: Assign tasks, set priorities, and track status.
- **Team Management**: Add/remove team members (Admin only).
- **Responsive Design**: Modern UI that works on desktop and mobile.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Axios, Lucide React, React Hot Toast.
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, Bcrypt.

## Local Setup

### 1. Prerequisites
- Node.js installed
- MongoDB Atlas account (for database)

### 2. Backend Setup
1. `cd backend`
2. `npm install`
3. Create a `.env` file and add your `MONGODB_URI` and `JWT_SECRET`.
4. `npm run dev`

### 3. Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## Deployment Instructions

### Backend (Railway)
1. Connect your GitHub repository to Railway.
2. Add your environment variables (`MONGODB_URI`, `JWT_SECRET`, etc.) in the Railway dashboard.
3. Railway will automatically detect the `package.json` and start the server.

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel.
2. Set the "Build Command" to `npm run build`.
3. Set the "Output Directory" to `dist`.
4. Add the `VITE_API_URL` environment variable pointing to your Railway backend URL.

## Folder Structure
- `/backend`: Express server, models, controllers, and routes.
- `/frontend`: React application with Vite and Tailwind CSS.
