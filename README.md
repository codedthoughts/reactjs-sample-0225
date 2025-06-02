# Task Management Application

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20App-brightgreen)](https://reactjs-sample-0225-0c8f.onrender.com)

A full-stack task management application with authentication, list creation, and task management features. This application allows users to create lists, add tasks to those lists, and manage their tasks efficiently.

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

## Live Demo

The application is deployed and can be accessed at: [https://reactjs-sample-0225-0c8f.onrender.com](https://reactjs-sample-0225-0c8f.onrender.com)

### Demo Credentials
- **Email**: demo@example.com
- **Password**: demo123

## Features

- **User Authentication**
  - Secure signup and login
  - JWT-based authentication
  - Protected routes

- **List Management**
  - Create and view lists
  - Organize tasks by lists
  - Clean and intuitive UI

- **Task Management**
  - Create tasks within lists
  - Update task status
  - Delete tasks
  - View task details

- **Responsive Design**
  - Works on mobile and desktop
  - Modern UI with Tailwind CSS

## Local Development

1. Clone the repository
   ```
   git clone https://github.com/codedthoughts/reactjs-sample-0225.git
   cd reactjs-sample-0225
   ```

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

## Project Structure

```
├── backend/                # Node.js/Express backend
│   ├── config/            # Database configuration
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Auth middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   └── server.js          # Express app entry point
├── frontend/              # React frontend (Vite)
│   ├── public/            # Static assets
│   └── src/               # Source code
│       ├── components/    # Reusable components
│       ├── pages/         # Page components
│       ├── utils/         # Utility functions
│       ├── App.jsx        # Main app component
│       └── main.jsx       # Entry point
└── package.json           # Root package.json for deployment
```

## Deployment

The application is deployed on Render as a single service. The deployment process includes:

1. Building the frontend React application
2. Setting up the Node.js backend
3. Configuring the backend to serve the frontend static files

### Deployment Configuration

- **Build Command**: `npm run render-build`
- **Start Command**: `npm run render-start`
- **Environment Variables**:
  - `PORT`: Port for the server to listen on
  - `MONGODB_URI`: MongoDB Atlas connection string
  - `JWT_SECRET`: Secret for JWT token generation
  - `NODE_ENV`: Set to 'production'

### How to Deploy Your Own Instance

1. Fork this repository
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Configure the build and start commands as above
5. Add the required environment variables
6. Deploy!

## Technical Implementation

### Frontend

- **React**: UI library for building the user interface
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Axios**: HTTP client for API requests
- **React Router**: For client-side routing

### Backend

- **Node.js**: JavaScript runtime
- **Express**: Web framework for Node.js
- **MongoDB**: NoSQL database for data storage
- **Mongoose**: MongoDB object modeling for Node.js
- **JWT**: JSON Web Tokens for authentication
- **bcrypt**: Password hashing library

### Authentication Flow

1. User registers or logs in
2. Backend validates credentials and issues a JWT token
3. Token is stored in localStorage
4. Token is included in Authorization header for API requests
5. Protected routes check token validity before processing requests

## API Documentation

### Authentication Endpoints

#### Register a new user
- **URL**: `/api/auth/signup`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "jwt_token"
  }
  ```

#### Login a user
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "jwt_token"
  }
  ```

### List Endpoints

#### Get all lists
- **URL**: `/api/lists`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer {token}`
- **Success Response**: `200 OK`
  ```json
  [
    {
      "_id": "list_id",
      "name": "Work Tasks",
      "userId": "user_id",
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  ]
  ```

#### Create a new list
- **URL**: `/api/lists`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
  ```json
  {
    "name": "Shopping List"
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "_id": "list_id",
    "name": "Shopping List",
    "userId": "user_id",
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
  ```

### Task Endpoints

#### Get all tasks
- **URL**: `/api/tasks`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer {token}`
- **Success Response**: `200 OK`
  ```json
  [
    {
      "_id": "task_id",
      "title": "Buy groceries",
      "description": "Milk, eggs, bread",
      "completed": false,
      "listId": "list_id",
      "userId": "user_id",
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  ]
  ```

#### Create a new task
- **URL**: `/api/tasks`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
  ```json
  {
    "title": "Complete project",
    "description": "Finish the React project",
    "listId": "list_id"
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "_id": "task_id",
    "title": "Complete project",
    "description": "Finish the React project",
    "completed": false,
    "listId": "list_id",
    "userId": "user_id",
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
  ```

#### Update a task
- **URL**: `/api/tasks/:id`
- **Method**: `PUT`
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
  ```json
  {
    "completed": true
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "_id": "task_id",
    "title": "Complete project",
    "description": "Finish the React project",
    "completed": true,
    "listId": "list_id",
    "userId": "user_id",
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
  ```

#### Delete a task
- **URL**: `/api/tasks/:id`
- **Method**: `DELETE`
- **Headers**: `Authorization: Bearer {token}`
- **Success Response**: `200 OK`
  ```json
  {
    "message": "Task removed"
  }
  ```
