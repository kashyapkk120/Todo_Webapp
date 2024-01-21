import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Import the CSS file

const Home = () => (
  <div className="container">
    <h2>Welcome to Todo App</h2>
    <div className="link-container">
      <Link to="/login">Login as User</Link>
      <Link to="/register">Register</Link>
      <Link to="/admin-login">Login as Admin</Link>
    </div>
  </div>
);

export default Home;