const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory array to store users (Use a database like MongoDB/PostgreSQL in production)
const users = []; 
const SECRET_KEY = 'your_super_secret_key'; // Store this in a .env file in production

// 1. User Registration Route
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: 'User already exists.' });
  }
  
  // Note: Passwords should ALWAYS be hashed (e.g., with bcrypt) before storing!
  users.push({ username, password }); 
  res.status(201).json({ message: 'User registered successfully!' });
});

// 2. User Login Route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }
  
  // Generate a JWT valid for 1 hour
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token, message: 'Login successful' });
});

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"
  
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  jwt.verify(token, SECRET_KEY, (err, decodedUser) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token.' });
    req.user = decodedUser;
    next();
  });
};

// 3. Protected Route
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ 
    message: `Success! You are accessing a protected route. Welcome, ${req.user.username}.` 
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));