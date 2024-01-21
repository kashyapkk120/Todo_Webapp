// src/App.js
import React from 'react';
import Home from './Components/Home';
import Login from './Components/Login';
import Register from './Components/Register';
// import Todo from './Components/Todo';
import Account from './Components/Account';
// import ViewAllTodos from './Components/ViewTodo';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminLogin from './Components/AdminLogin'
import AdminDashboard from './Components/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
    
        <Route path="/account" element={<Account />} />
       
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-login" element={<AdminLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
