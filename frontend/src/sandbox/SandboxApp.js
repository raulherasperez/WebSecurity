import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPageSandbox from './LoginPageSandbox';
import SandboxShop from './SandboxShop';
import SandboxProductDetail from './SandboxProductDetail';
import SandboxProfile from './SandboxProfile';
import SandboxAdmin from './SandboxAdmin';
import SandboxUserDetail from './SandboxUserDetail';


const SandboxApp = () => {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('sandboxUser');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      sessionStorage.setItem('sandboxUser', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('sandboxUser');
    }
  }, [user]);

  if (!user) return <LoginPageSandbox onLogin={setUser} />;

  return (
    <Routes>
      <Route path="/" element={<SandboxShop user={user} />} />
      <Route path="producto" element={<SandboxProductDetail user={user} />} />
      <Route path="perfil" element={<SandboxProfile user={user} />} />
      <Route path="admin" element={<SandboxAdmin />} />
      <Route path="admin/usuario/:id" element={<SandboxUserDetail />} />
    </Routes>
  );
};

export default SandboxApp;