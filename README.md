# Task Management Application

A full-stack task management application with authentication, list creation, and task management features.

## Technologies Used

### Frontend
- React with Vite
- Tailwind CSS for styling
- Axios for API requests
- React Router for navigation

### Backend
- Node.js with Express
- MongoDB for database (MongoDB Atlas)
- JWT for authentication

## Local Development

1. Clone the repository
2. Install dependencies:
   ```
   npm run install-all
   ```

3. Set up environment variables:
   - Create a `.env` file in the backend directory with:
     ```
     PORT=5000
     MONGODB_URI=mongodb+srv://sarthak17052004:sarthak@clusterofsarthak.yucf8.mongodb.net/?retryWrites=true&w=majority&appName=ClusterofSarthak
     JWT_SECRET=your_jwt_secret_here
     NODE_ENV=development
     ```
   - Create a `.env` file in the frontend directory with:
     ```
     VITE_API_URL=http://localhost:5000/api
     ```

4. Start the development servers:
   ```
   npm run dev
   ```
   This will start both the frontend and backend servers concurrently.

## Deployment on Render

### Option 1: Deploy as Separate Services

1. Deploy the backend:
   - Create a new Web Service on Render
   - Connect your GitHub repository
   - Set the build command to `cd backend && npm install`
   - Set the start command to `node backend/server.js`
   - Add environment variables:
     - `PORT`: 5000
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: A secure random string
     - `NODE_ENV`: production
     - `FRONTEND_URL`: Your frontend URL on Render

2. Deploy the frontend:
   - Create a new Static Site on Render
   - Connect your GitHub repository
   - Set the build command to `cd frontend && npm install && npm run build`
   - Set the publish directory to `frontend/dist`
   - Add environment variables:
     - `VITE_API_URL`: Your backend URL on Render + `/api`

### Option 2: Deploy as a Monorepo (Using render.yaml)

1. Push your code to GitHub
2. Create a new Blueprint on Render
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` file and set up both services

## Features

- User authentication (login/signup)
- Create and manage lists
- Create and manage tasks within lists
- Mark tasks as complete
- View task details
- Responsive design for mobile and desktop

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login a user

### Lists
- `GET /api/lists` - Get all lists for the authenticated user
- `POST /api/lists` - Create a new list

### Tasks
- `GET /api/tasks` - Get all tasks for the authenticated user
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
