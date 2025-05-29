import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ActivateAccountPage = () => {
  const [message, setMessage] = useState('Activando cuenta...');
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    axios.get(`http://localhost:8080/api/users/verify?token=${token}`)
      .then(res => setMessage(res.data))
      .catch(err => setMessage(err.response?.data || 'Error al activar la cuenta'));
  }, []);
  return (
    <div className="auth-form-container">
      <h2>Activación de cuenta</h2>
      <p>{message}</p>
    </div>
  );
};
export default ActivateAccountPage;