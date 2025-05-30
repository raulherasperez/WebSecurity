import React, { useState } from 'react';
import axios from 'axios';
import './css/LoginPageSandbox.css';

const LoginPageSandbox = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async e => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await axios.post('http://localhost:5001/sandbox/login', { username, password });
      if (res.data.success) {
        onLogin(res.data.user);
      } else {
        setMessage(res.data.error);
      }
    } catch (err) {
      setMessage('Error de red');
    }
  };

  return (
    <div className="sandbox-login-container">
      <h2>Login Sandbox</h2>
      <form onSubmit={handleLogin}>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Usuario" required />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" required />
        <button type="submit">Entrar</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default LoginPageSandbox;