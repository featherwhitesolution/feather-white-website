# Backend Deployment Guide

Deploying a backend is different from a frontend. You cannot just drag-and-drop files.

## Prerequisites

1.  **Cloud Database (MongoDB Atlas)**
    *   Your local database (`mongodb://localhost...`) only exists on your computer.
    *   The deployed backend needs a database accessible from the internet.
    *   **Action**: Create a free MongoDB Atlas account and get a connection string.

2.  **Git & GitHub**
    *   Most backend hosting services (Render, Railway, Heroku) require your code to be on GitHub.
    *   **Action**: Install Git, create a GitHub repository, and push your code.

3.  **Hosting Service (Render)**
    *   We will use **Render** (render.com) because it has a free tier for Node.js.

## Step 1: Set up MongoDB Atlas (Cloud Database)

1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Create an account and a **Free Shared Cluster**.
3.  **Database Access**: Create a database user (username and password). Note these down!
4.  **Network Access**: Allow access from **Anywhere (0.0.0.0/0)**. This is important for Render to connect.
5.  **Get Connection String**:
    *   Click "Connect".
    *   Choose "Drivers".
    *   Copy the string (e.g., `mongodb+srv://<username>:<password>@cluster0.mongodb.net/...`).
    *   Replace `<password>` with your actual password.

## Step 2: Install Git (If not installed)

1.  Download Git from [git-scm.com](https://git-scm.com/downloads).
2.  Install it (accept defaults).
3.  Open a new terminal/command prompt and type `git --version` to verify.

## Step 3: Push to GitHub

1.  Create a new repository on GitHub (e.g., `feather-white-backend`).
2.  Open your project folder in terminal.
3.  Run these commands:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
    git push -u origin main
    ```

## Step 4: Deploy to Render

1.  Sign up on [Render.com](https://render.com).
2.  Click **New +** -> **Web Service**.
3.  Connect your GitHub repository.
4.  **Settings**:
    *   **Root Directory**: `backend` (Important!)
    *   **Build Command**: `npm install`
    *   **Start Command**: `node server.js`
5.  **Environment Variables** (Advanced):
    *   Key: `MONGO_URI`, Value: Your Atlas Connection String
    *   Key: `JWT_SECRET`, Value: (Any secret string)
    *   Key: `NODE_ENV`, Value: `production`
6.  Click **Create Web Service**.

## Step 5: Update Frontend

1.  Once deployed, Render will give you a URL (e.g., `https://feather-white.onrender.com`).
2.  Update your Netlify environment variable `VITE_API_URL` to this new URL.
