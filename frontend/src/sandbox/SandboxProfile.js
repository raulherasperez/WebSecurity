import React, { useState } from 'react';
import axios from 'axios';
import './css/SandboxShop.css';

const SandboxProfile = ({ user }) => {
  const [nuevoEmail, setNuevoEmail] = useState('');
  const [msg, setMsg] = useState('');

  const handleChangeEmail = async e => {
    e.preventDefault();
    setMsg('');
    try {
      // CSRF vulnerable: no token, solo username y email
      const form = new FormData();
      form.append('username', user.nombre);
      form.append('nuevo_email', nuevoEmail);
      const res = await axios.post('http://localhost:5001/sandbox/cambiar-email', form);
      setMsg(res.data.msg || '¡Email actualizado!');
    } catch {
      setMsg('Error al actualizar email');
    }
  };

  return (
    <div className="sandbox-product-detail-page">
      <h3>Perfil de usuario</h3>
      <div style={{ marginBottom: 18 }}>
        <strong>Usuario:</strong> {user.nombre}<br />
        <strong>Email:</strong> {user.email}
      </div>
      <form onSubmit={handleChangeEmail} className="sandbox-review-form">
        <input
          type="email"
          value={nuevoEmail}
          onChange={e => setNuevoEmail(e.target.value)}
          placeholder="Nuevo email"
          required
          className="sandbox-review-autor"
        />
        <button type="submit" className="sandbox-review-btn">Cambiar email</button>
      </form>
      {msg && <div className="sandbox-review-msg">{msg}</div>}
    </div>
  );
};

export default SandboxProfile;