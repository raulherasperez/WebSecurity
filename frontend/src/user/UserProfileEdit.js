import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/UserProfile.css';

const UserProfileEdit = ({ onProfileUpdated }) => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('authToken');
      try {
        const response = await axios.get('http://localhost:8080/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
        setUsername(response.data.username);
        setEmail(response.data.email);
        if (response.data.foto) setPreview(`data:image/jpeg;base64,${response.data.foto}`);
      } catch {
        setMessage('No se pudo cargar el perfil');
      }
    };
    fetchUser();
  }, []);

  const handleFotoChange = e => {
    const file = e.target.files[0];
    setFoto(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    const token = localStorage.getItem('authToken');
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    if (foto) formData.append('foto', foto);

    try {
      await axios.put('http://localhost:8080/api/users/me', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage('Perfil actualizado');
      if (onProfileUpdated) onProfileUpdated();
    } catch {
      setMessage('Error actualizando el perfil');
    }
  };

  if (!user) return <div>Cargando...</div>;

return (
  <form className="user-profile-container" onSubmit={handleSubmit}>
    <div>
      <label>Foto de perfil:</label><br />
      <input
        type="file"
        id="foto-input"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFotoChange}
      />
      {preview && (
        <img src={preview} alt="Preview" className="user-profile-photo" style={{ marginTop: 10 }} />
      )}
      <button
        type="button"
        className="user-profile-edit-btn"
        onClick={() => document.getElementById('foto-input').click()}
        style={{ marginTop: 10, marginBottom: 10 }}
      >
        Seleccionar archivo
      </button>
      {foto && <span style={{ marginLeft: 8 }}>{foto.name}</span>}
    </div>
    <div>
      <label>Nombre de usuario:</label>
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

    <button type="submit" className="user-profile-edit-btn">Guardar cambios</button>
    {message && <div style={{ marginTop: 12, color: '#1976d2' }}>{message}</div>}

  </form>
);
};

export default UserProfileEdit;