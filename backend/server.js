const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3002;
const JWT_SECRET = 'your-secret-key';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mock users database
const users = [
  { id: 'u1', username: 'alice', password: 'password', fullName: 'Alice Tester', role: 'TESTER', email: 'alice@example.com' },
  { id: 'u2', username: 'bob', password: 'password', fullName: 'Bob Dev', role: 'DEVELOPER', email: 'bob@example.com' },
  { id: 'u3', username: 'carol', password: 'password', fullName: 'Carol QA', role: 'QA', email: 'carol@example.com' }
];

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  console.log('Login attempt:', { username, password });
  
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid credentials' 
    });
  }
  
  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;
  
  res.json({
    success: true,
    token,
    user: userWithoutPassword
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  POST /login - User login');
  console.log('  GET  /health - Health check');
});