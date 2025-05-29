import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/AuthForm.css';
import LogoHomeLink from '../components/LogoHomeLink';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/'); // Redirige a la página principal si ya hay sesión
    }
  }, [user, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    if (password !== confirmPassword) {
      setMessage('Las contraseñas no coinciden');
      return;
    }
    try {
      const response = await axios.post('http://localhost:8080/api/users/register', {
        username,
        password,
        email
      });
      // Si el backend responde con éxito, muestra mensaje de activación
      if (response.data.startsWith('Registro exitoso')) {
        setMessage('Registro exitoso. Revisa tu correo para activar tu cuenta antes de iniciar sesión.');
      } else {
        setMessage(response.data);
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
        <div>
          <label>Repite la contraseña:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
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