import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/SandboxShop.css';

const SandboxShop = ({ user }) => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [search, setSearch] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategorias();
    fetchProductos();
    // eslint-disable-next-line
  }, []);

  const fetchCategorias = async () => {
    try {
      const res = await axios.get('http://localhost:5001/vulnerable-categorias');
      setCategorias(res.data);
    } catch {
      setCategorias([]);
    }
  };

  const fetchProductos = async () => {
    try {
      let url = `http://localhost:5001/sandbox/productos`;
      if (search) url += `?search=${encodeURIComponent(search)}`;
      if (categoriaSeleccionada) {
        url += (url.includes('?') ? '&' : '?') + `categoria=${encodeURIComponent(categoriaSeleccionada)}`;
      }
      const res = await axios.get(url);
      setProductos(res.data.productos || []);
    } catch {
      setProductos([]);
    }
  };

  const handleSearch = e => {
    e.preventDefault();
    fetchProductos();
  };

  // Simular imágenes de productos si no hay
  const getProductImage = (prod) => prod.imagen || `https://picsum.photos/300/200?grayscale&blur=2`;

  return (
    <div className="sandbox-shop-main">
      <div className="sandbox-shop-header">
        <h2 className="sandbox-shop-title">Tienda Sandbox</h2>
        {user && (
          <button
            className="sandbox-profile-link"
            onClick={() => navigate('/sandbox-tienda/perfil')}
            title="Ir al perfil"
          >
            <span className="sandbox-profile-user">{user.nombre}</span> <span role="img" aria-label="perfil">👤</span>
          </button>
        )}
      </div>
      <form className="sandbox-toolbar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Buscar producto (vulnerable a inyección)"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="sandbox-search"
        />
        <select
          value={categoriaSeleccionada}
          onChange={e => setCategoriaSeleccionada(e.target.value)}
          className="sandbox-select"
        >
          <option value="">Todas las categorías</option>
          {categorias.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <button type="submit" className="sandbox-btn">Buscar</button>
      </form>
      <div className="sandbox-catalogo">
        {productos.map(prod => (
          <div
            key={prod.id}
            className="sandbox-product-card"
            onClick={() => navigate(`/sandbox-tienda/producto?id=${prod.id}`)}
          >
            <div className="sandbox-product-img-wrap">
              <img
                src={getProductImage(prod)}
                alt={prod.nombre}
                className="sandbox-product-img"
                loading="lazy"
                onError={e => { e.target.src = "https://picsum.photos/300/200?grayscale&blur=2"; }}
              />
            </div>
            <div className="sandbox-product-name">{prod.nombre}</div>
            <div className="sandbox-product-cat">{prod.categoria}</div>
            <div className="sandbox-product-price">{prod.precio} €</div>
            <div className="sandbox-product-stock">Stock: {prod.stock}</div>
            <div style={{ marginTop: 8, color: '#2980b9', fontSize: '0.95rem' }}>
              Ver detalle
            </div>
          </div>
        ))}
      </div>
      {productos.length === 0 && <div className="sandbox-empty">No hay productos para mostrar.</div>}
    </div>
  );
};

export default SandboxShop;