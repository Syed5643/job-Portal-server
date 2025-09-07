import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage(''); // Clear previous messages
        
        try {
            console.log('Attempting to log in with:', email); // DEBUG LOG 1
            const response = await axios.post('https://job-portal-server-1-44l9.onrender.com/api/login', { email, password });
            const token = response.data.token;
            
            console.log('Login successful, token received:', token); // DEBUG LOG 2
            localStorage.setItem('token', token);
            
            const decodedToken = jwtDecode(token);
            console.log('Decoded token:', decodedToken); // DEBUG LOG 3

            const userRole = decodedToken.role;
            console.log('User role found:', userRole); // DEBUG LOG 4

            if (userRole === 'student') {
                console.log('Navigating to student dashboard...'); // DEBUG LOG 5
                navigate('/student-dashboard');
            } else if (userRole === 'employer') {
                console.log('Navigating to employer dashboard...'); // DEBUG LOG 5
                navigate('/employer-dashboard');
            } else {
                console.error('No role found in token!'); // Error if role is missing
                setMessage('Login failed: User role not identified.');
            }

        } catch (error) {
            console.error('Login failed!', error); // This will show the full error object
            setMessage(error.response ? error.response.data.message : 'An error occurred during login.');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div><input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                <div><input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
                <button type="submit">Login</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default LoginPage;