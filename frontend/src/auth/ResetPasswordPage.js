import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    if (newPassword !== confirmNewPassword) {
      setMessage('Las contraseñas no coinciden');
      return;
    }
    try {
      const res = await axios.post('http://localhost:8080/api/users/reset-password', { token, newPassword });
      setMessage(res.data);
      if (res.data && res.data.toLowerCase().includes('contraseña restablecida')) {
        setTimeout(() => {
          navigate('/login');
        }, 2000); // Redirige después de 2 segundos
      }
    } catch (err) {
      setMessage(err.response?.data || 'Error al restablecer contraseña');
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Restablecer contraseña</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          required
          placeholder="Nueva contraseña"
        />
        <input
          type="password"
          value={confirmNewPassword}
          onChange={e => setConfirmNewPassword(e.target.value)}
          required
          placeholder="Repite la nueva contraseña"
          style={{ marginTop: 10 }}
        />
        <button type="submit" style={{ marginTop: 10 }}>Actualizar</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPasswordPage;