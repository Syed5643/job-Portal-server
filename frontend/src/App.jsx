import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import './App.css';

// Navigation Bar Component
function Navigation() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    window.location.reload(); // Reload to update nav
  };

  return (
    <nav className="container-fluid">
      <ul>
        <li><strong>Job Portal</strong></li>
      </ul>
      <ul>
        <li><Link to="/">Home</Link></li>
        {!token && <li><Link to="/login">Login</Link></li>}
        {!token && <li><Link to="/register">Register</Link></li>}
        {token && <li><a href="#" onClick={handleLogout} role="button">Logout</a></li>}
      </ul>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <Navigation />
      {/* Wrap the content in a main container for nice centering and padding */}
      <main className="container">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/employer-dashboard" element={<EmployerDashboard />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
    </Router>
  );
}

// Simple Home Page Component
function Home() {
  return (
    <article>
      <header>
        <h2>Welcome to the Job Portal!</h2>
      </header>
      <p>This is a full-stack web application built with React and Node.js. Students can browse and apply for jobs, while employers can post job listings and view applicants.</p>
      <p>Please log in or register to continue.</p>
    </article>
  );
}

export default App;