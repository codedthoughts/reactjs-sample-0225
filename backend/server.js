const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const listRoutes = require('./routes/listRoutes');

const app = express();
app.use(express.json());
// Configure CORS based on environment
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? [process.env.FRONTEND_URL || 'https://your-frontend-url.onrender.com']
    : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Add basic security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/lists', listRoutes);

// API status route
app.get('/api/status', (req, res) => {
  res.send('API is running...');
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  const frontendBuildPath = path.join(__dirname, '../frontend/dist');
  
  app.use(express.static(frontendBuildPath));

  // Serve index.html for specific frontend routes
  const frontendRoutes = [
    '/',
    '/login',
    '/signup',
    '/dashboard'
  ];
  
  frontendRoutes.forEach(route => {
    app.get(route, (req, res) => {
      res.sendFile(path.resolve(frontendBuildPath, 'index.html'));
    });
  });
}

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
