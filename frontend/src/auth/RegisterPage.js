import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/AuthForm.css';
import LogoHomeLink from '../components/LogoHomeLink';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await axios.post('http://localhost:8080/api/users/register', {
        username,
        password,
        email
      });
      setMessage(response.data);
      if (response.data === 'User registered successfully') {
        // Login automático después del registro
        try {
          const loginResponse = await axios.post('http://localhost:8080/api/users/login', {
            username,
            password
          });
          const data = typeof loginResponse.data === 'string' ? JSON.parse(loginResponse.data) : loginResponse.data;
          if (data.token) {
            // Obtener el usuario con el token y actualizar el contexto
            const userRes = await axios.get('http://localhost:8080/api/users/me', {
              headers: { Authorization: `Bearer ${data.token}` }
            });
            login(userRes.data, data.token);
            navigate('/'); // Redirige a la página principal
          } else {
            setMessage('Registro exitoso, pero error al iniciar sesión.');
          }
        } catch (loginError) {
          setMessage('Registro exitoso, pero error al iniciar sesión.');
        }
      }
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data || 'Error en el registro');
      } else {
        setMessage('Error de red');
      }
    }
  };

  return (
    <div className="auth-form-container">
      <LogoHomeLink />
      <h2>Registro</h2>
      <form onSubmit={handleRegister}>
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
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
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
        <button type="submit" style={{ width: '100%' }}>Registrarse</button>
      </form>
      {message && <p style={{ marginTop: 15 }}>{message}</p>}
    </div>
  );
};

export default RegisterPage;