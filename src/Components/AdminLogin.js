// src/components/AdminLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    
    if (email === 'admin@gmail.com' && password === '6163@Admin') {
      console.log('Successfully logged in as admin!');
    
      navigate('/admin-dashboard');
    } else {
      setError('Invalid admin credentials');
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Login as Admin</h2>
      {error && (
        <div style={errorStyle}>
          {error}
        </div>
      )}
      <form onSubmit={handleLogin} style={formStyle}>
        <label style={labelStyle}>Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
        </label>
        <br />
        <label style={labelStyle}>Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
        </label>
        <br />
        <button type="submit" style={buttonStyle}>Login as Admin</button>
      </form>
    </div>
  );
};

// Inline styles
const containerStyle = {
  maxWidth: '300px',
  margin: 'auto',
  padding: '20px',
  border: '1px solid #ddd',
  borderRadius: '5px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  marginTop: '50px',
};

const titleStyle = {
  textAlign: 'center',
  color: '#333',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const labelStyle = {
  marginBottom: '10px',
  fontWeight: 'bold',
};

const inputStyle = {
  width: '100%',
  padding: '8px',
  marginBottom: '15px',
};

const buttonStyle = {
  backgroundColor: '#4caf50',
  color: 'white',
  padding: '10px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const errorStyle = {
  border: '1px solid red',
  padding: '10px',
  marginBottom: '10px',
  color: 'red',
};

export default AdminLogin;
