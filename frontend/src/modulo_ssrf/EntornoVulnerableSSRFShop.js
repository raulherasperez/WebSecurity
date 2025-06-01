import React, { useState, useEffect } from 'react';
import './css/EntornoVulnerableSSRFShop.css';
import { desbloquearLogro } from '../services/logroService';
import ModalLogroDesbloqueado from '../components/ModalLogroDesbloqueado';

const API_URL = process.env.REACT_APP_VULNERABLE_URL;

// Obtiene el nivel SSRF de localStorage
function getNivelSSRF() {
  return localStorage.getItem('nivelSSRF') || 'facil';
}

// Establece el nivel SSRF en el backend (sesión)
async function setNivelSSRF(nivel) {
  await fetch(`${API_URL}/set-nivel-ssrf`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nivel })
  });
}

function EntornoVulnerableSSRFShop() {
  const [productos] = useState([
    { id: 1, nombre: 'Camiseta', precio: 19.99, stock: 12 },
    { id: 2, nombre: 'Pantalón', precio: 29.99, stock: 8 },
    { id: 3, nombre: 'Zapatillas', precio: 49.99, stock: 5 }
  ]);
  const [usuarios] = useState([
    { id: 1, nombre: 'admin', rol: 'Administrador' },
    { id: 2, nombre: 'juan', rol: 'Usuario' },
    { id: 3, nombre: 'maria', rol: 'Usuario' }
  ]);

  // SSRF vulnerable preview
  const [imgUrl, setImgUrl] = useState('');
  const [previewSrc, setPreviewSrc] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [internalContent, setInternalContent] = useState('');
  const [logroDesbloqueado, setLogroDesbloqueado] = useState(null);

  // Al entrar, establecer el nivel SSRF en la sesión del backend
  useEffect(() => {
    const nivel = getNivelSSRF();
    setNivelSSRF(nivel);
    // eslint-disable-next-line
  }, []);

  const handlePreview = async (e) => {
    e.preventDefault();
    setError('');
    setPreviewSrc('');
    setShowSuccessModal(false);
    setInternalContent('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/ssrf-producto-preview?url=${encodeURIComponent(imgUrl)}&t=${Date.now()}`, {
        credentials: 'include'
      });
      if (res.ok) {
        const blob = await res.blob();
        if (blob.type.startsWith('image/')) {
          setPreviewSrc(URL.createObjectURL(blob));
        } else {
          const text = await blob.text();
          setError(text);
          // Si se recibe cualquier tipo de información (no imagen), mostrar modal de éxito
          if (text && text.trim().length > 0) {
            setInternalContent(text);
            setShowSuccessModal(true);

            // Desbloquear logro "SSRF Hunter" y mostrar modal
            try {
              const token = localStorage.getItem('authToken');
              const resLogro = await desbloquearLogro(token, "Misión código SSRF");
              if (resLogro) {
                setLogroDesbloqueado(resLogro);
              }
            } catch {}
          }
        }
      } else {
        // Puede devolver error en JSON o texto plano
        let text = '';
        try {
          const data = await res.json();
          text = data.error || 'Error al obtener la imagen';
        } catch {
          text = await res.text();
        }
        setError(text);
      }
    } catch (err) {
      setError('No se pudo conectar con el backend');
    }
    setLoading(false);
  };

  return (
    <div className="ssrfshop-container">
      <h2>Panel de administración de la tienda</h2>
      <p>
        Bienvenido al panel de administración. Aquí puedes gestionar productos, usuarios y ver información relevante de la tienda.
      </p>
      <section style={{ marginTop: 24 }}>
        <h3>Productos</h3>
        <table className="ssrfshop-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(prod => (
              <tr key={prod.id}>
                <td>{prod.id}</td>
                <td>{prod.nombre}</td>
                <td>{prod.precio} €</td>
                <td>{prod.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section style={{ marginTop: 32 }}>
        <h3>Usuarios</h3>
        <table className="ssrfshop-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Rol</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.nombre}</td>
                <td>{u.rol}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section style={{ marginTop: 32 }}>
        <h3>Estadísticas</h3>
        <ul>
          <li>Total de productos: {productos.length}</li>
          <li>Total de usuarios: {usuarios.length}</li>
          <li>Ventas este mes: 37</li>
        </ul>
      </section>
      <section style={{ marginTop: 40 }}>
        <h3>Vista previa de imagen de producto (vulnerable a SSRF)</h3>
        <form className="ssrfshop-form" onSubmit={handlePreview}>
          <input
            type="text"
            placeholder="URL de la imagen del producto"
            value={imgUrl}
            onChange={e => setImgUrl(e.target.value)}
            className="ssrfshop-input"
            required
          />
          <button type="submit" className="ssrfshop-btn" disabled={loading}>
            {loading ? 'Cargando...' : 'Vista previa'}
          </button>
        </form>
        <div className="ssrfshop-preview">
          {previewSrc && (
            <div>
              <img src={previewSrc} alt="Vista previa" className="ssrfshop-img" />
              <div className="ssrfshop-success">¡Imagen cargada desde el servidor!</div>
            </div>
          )}
          {error && <div className="ssrfshop-error">{error}</div>}
        </div>
      </section>
      {showSuccessModal && (
        <div className="ssrfshop-modal">
          <div className="ssrfshop-modal-content">
            <h2 style={{ color: '#388e3c' }}>¡Ejercicio completado!</h2>
            <p>Has accedido con éxito a contenido interno a través de SSRF.</p>
            <pre style={{ background: '#f7f7f7', padding: 10, borderRadius: 6, maxHeight: 200, overflow: 'auto' }}>
              {internalContent}
            </pre>
            <button className="ssrfshop-btn" onClick={() => setShowSuccessModal(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
      {logroDesbloqueado && (
        <ModalLogroDesbloqueado
          logro={logroDesbloqueado}
          onClose={() => setLogroDesbloqueado(null)}
        />
      )}
    </div>
  );
}

export default EntornoVulnerableSSRFShop;