import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './css/VulnerableShop.css';

const RETOS = [
  { id: 1, nombre: 'Login vulnerable', descripcion: 'Has iniciado sesión usando inyección SQL.' },
  { id: 3, nombre: 'Filtrar productos ocultos', descripcion: 'Has mostrado productos de la categoría "Oculta" usando filtros e inyección SQL.' }
];

const VulnerableShop = () => {
  // Login
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Productos y filtros
  const [search, setSearch] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState('');

  // Modal de éxito
  const [retoCompletado, setRetoCompletado] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Al montar: recuperar login de localStorage
  useEffect(() => {
    const logged = localStorage.getItem('vshopLogin');
    if (logged === 'true') setLoginSuccess(true);
  }, []);

  // Al cambiar la ruta, si sales de /modulo/sql-inyeccion/tienda, borra el login
  useEffect(() => {
    if (!location.pathname.startsWith('/modulo/sql-inyeccion/tienda')) {
      setLoginSuccess(false);
      localStorage.removeItem('vshopLogin');
    }
    // eslint-disable-next-line
  }, [location.pathname]);

  // Cargar categorías y productos al inicio tras login
  useEffect(() => {
    if (!loginSuccess) return;
    const fetchCategorias = async () => {
      try {
        const res = await axios.get('http://localhost:5001/vulnerable-categorias');
        setCategorias(res.data);
      } catch {
        setCategorias([]);
      }
    };
    fetchCategorias();
    fetchProductos();
    // eslint-disable-next-line
  }, [loginSuccess]);

  // Buscar productos
  const fetchProductos = async () => {
    try {
      let url = `http://localhost:5001/vulnerable-productos?search=${encodeURIComponent(search)}`;
      if (categoriaSeleccionada) {
        url += `&categoria=${encodeURIComponent(categoriaSeleccionada)}`;
      }
      const res = await axios.get(url);
      setProductos(res.data);
      setError('');
      // Detectar reto 3: productos ocultos en la lista
      if (Array.isArray(res.data) && res.data.some(prod => prod.categoria === "Oculta")) {
        setRetoCompletado(3);
      }
    } catch (err) {
      setError('Error al cargar productos');
    }
  };

  // Login vulnerable
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5001/vulnerable-login', {
        username,
        password
      });
      if (res.data && res.data.success) {
        setLoginSuccess(true);
        localStorage.setItem('vshopLogin', 'true');
        setRetoCompletado(1);
      } else {
        setLoginSuccess(false);
      }
    } catch {
      setLoginSuccess(false);
    }
  };

  // Simular imágenes de productos
  const getProductImage = (prod) => prod.imagen || `https://picsum.photos/300/200?grayscale&blur=2`;

  // --- Renderizado ---

  // 1. Solo login si no hay login
  if (!loginSuccess) {
    return (
      <div className="vshop-container">
        <header className="vshop-header">
          <span className="vshop-logo">🛒</span>
          <span className="vshop-title">WebSec Shop</span>
          <span className="vshop-vuln">(Vulnerable a SQLi)</span>
        </header>
        <section className="vshop-section">
          <h3>Login vulnerable</h3>
          <form onSubmit={handleLogin} className="vshop-login-form">
            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="vshop-login-input"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="vshop-login-input"
            />
            <button type="submit" className="vshop-btn">Iniciar sesión</button>
          </form>
          {loginSuccess === false && <div className="vshop-error">Login fallido.</div>}
        </section>
        {/* Modal de éxito */}
        {retoCompletado && (
          <div className="vshop-modal-overlay" onClick={() => setRetoCompletado(null)}>
            <div className="vshop-modal" onClick={e => e.stopPropagation()} style={{ position: 'relative' }}>
              <button
                className="vshop-modal-close"
                onClick={() => setRetoCompletado(null)}
                aria-label="Cerrar"
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 14,
                  background: 'transparent',
                  border: 'none',
                  fontSize: '1.5rem',
                  color: '#888',
                  cursor: 'pointer'
                }}
              >
                &times;
              </button>
              <h3 className="vshop-modal-title">¡Ejercicio completado con éxito!</h3>
              <p>{RETOS.find(r => r.id === retoCompletado)?.descripcion}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. Catálogo tras login
  return (
    <div className="vshop-container">
      <header className="vshop-header">
        <span className="vshop-logo">🛒</span>
        <span className="vshop-title">WebSec Shop</span>
        <span className="vshop-vuln">(Vulnerable a SQLi)</span>
      </header>

      {/* Filtros y listado de productos */}
      <section className="vshop-section">
        <h3>Catálogo de productos</h3>
        <div className="vshop-toolbar">
          <input
            type="text"
            placeholder="Buscar producto (prueba inyección SQL)"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="vshop-search"
            onKeyDown={e => { if (e.key === 'Enter') fetchProductos(); }}
          />
          <select
            value={categoriaSeleccionada}
            onChange={e => setCategoriaSeleccionada(e.target.value)}
            className="vshop-select"
          >
            <option value="">Todas las categorías</option>
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button
            onClick={fetchProductos}
            className="vshop-btn"
          >
            Buscar
          </button>
        </div>
        {error && <div className="vshop-error">{error}</div>}
        <div className="vshop-grid">
          {productos.map(prod => (
            <div
              key={prod.id}
              className="vshop-product"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/modulo/sql-inyeccion/tienda/producto?id=${prod.id}`)}
            >
              <div className="vshop-product-img-wrap">
                <img
                  src={getProductImage(prod)}
                  alt={prod.nombre}
                  className="vshop-product-img"
                  loading="lazy"
                  onError={e => { e.target.src = "https://picsum.photos/300/200?grayscale&blur=2"; }}
                />
              </div>
              <div className="vshop-product-name">{prod.nombre}</div>
              <div className="vshop-product-cat">{prod.categoria}</div>
              <div className="vshop-product-price">{prod.precio} €</div>
              <div className="vshop-product-stock">Stock: {prod.stock}</div>
              <div style={{ marginTop: 8, color: '#2980b9', fontSize: '0.95rem' }}>Ver detalle</div>
            </div>
          ))}
        </div>
        {productos.length === 0 && <div className="vshop-empty">No hay productos para mostrar.</div>}
      </section>

      {/* Modal de éxito */}
      {retoCompletado && (
        <div className="vshop-modal-overlay" onClick={() => setRetoCompletado(null)}>
          <div className="vshop-modal" onClick={e => e.stopPropagation()} style={{ position: 'relative' }}>
            <button
              className="vshop-modal-close"
              onClick={() => setRetoCompletado(null)}
              aria-label="Cerrar"
              style={{
                position: 'absolute',
                top: 10,
                right: 14,
                background: 'transparent',
                border: 'none',
                fontSize: '1.5rem',
                color: '#888',
                cursor: 'pointer'
              }}
            >
              &times;
            </button>
            <h3 className="vshop-modal-title">¡Ejercicio completado con éxito!</h3>
            <p>{RETOS.find(r => r.id === retoCompletado)?.descripcion}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VulnerableShop;