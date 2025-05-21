import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('No autenticado');
        return;
      }
      try {
        const response = await axios.get('http://localhost:8080/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(response.data);
      } catch (err) {
        setError('No se pudo obtener la información del usuario.');
      }
    };
    fetchUser();
  }, []);

  if (error) return <div>{error}</div>;
  if (!user) return <div>Cargando...</div>;

  return (
    <div>
      <h2>Perfil de usuario</h2>
      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Usuario:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
    </div>
  );
};

export default UserProfile;