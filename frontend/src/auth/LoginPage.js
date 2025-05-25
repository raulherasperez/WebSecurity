import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/AuthForm.css';
import LogoHomeLink from '../components/LogoHomeLink';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

    useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/'); // Redirige a la página principal si ya hay sesión
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await axios.post('http://localhost:8080/api/users/login', {
        username,
        password,
      });
      // Parse the token from the response
      const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('username', username);
        setMessage('Login successful');
        navigate('/'); // Redirect to the main page
        // Optionally, redirect or fetch user info here
      } else {
        setMessage('Login failed');
      }
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data || 'Login failed');
      } else {
        setMessage('Network error');
      }
    }
  };

  return (
    
    <div className="auth-form-container">
      <LogoHomeLink />
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Usuario:</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            style={{ width: '100%', marginBottom: 10 }}
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: '100%', marginBottom: 10 }}
          />
        </div>
        <button type="submit" style={{ width: '100%' }}>Entrar</button>
      </form>
      {message && <p style={{ marginTop: 15 }}>{message}</p>}
    </div>
  );
};

export default LoginPage;