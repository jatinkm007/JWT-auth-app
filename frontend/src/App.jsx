import React, { useState } from 'react';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [statusMessage, setStatusMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    setStatusMessage(data.message);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    
    if (data.token) {
      setToken(data.token);
      localStorage.setItem('token', data.token); // Persist token
      setStatusMessage('Login successful!');
    } else {
      setStatusMessage(data.message);
    }
  };

  const accessProtectedRoute = async () => {
    const response = await fetch('http://localhost:5000/protected', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    setStatusMessage(data.message);
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
    setStatusMessage('You have been logged out.');
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h2>JWT Auth System</h2>
      
      {!token ? (
        <form style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleRegister}>Register</button>
            <button onClick={handleLogin}>Login</button>
          </div>
        </form>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={accessProtectedRoute}>Access Protected Route</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}

      {statusMessage && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
          <strong>Status:</strong> {statusMessage}
        </div>
      )}
    </div>
  );
}

export default App;