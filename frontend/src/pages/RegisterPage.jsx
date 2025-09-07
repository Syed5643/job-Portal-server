import React, { useState } from 'react';
import axios from 'axios';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
        setMessage('All fields are required');
        return;
    }
    if (password.length < 6) {
        setMessage('Password must be at least 6 characters');
        return;
    }
    try {
      const response = await axios.post('https://job-portal-server-1-44l9.onrender.com/api/signup', {
        name, email, password, role,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div><input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} /></div>
        <div><input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div><input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        <div>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="student">Student</option>
            <option value="employer">Employer</option>
          </select>
        </div>
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default RegisterPage;