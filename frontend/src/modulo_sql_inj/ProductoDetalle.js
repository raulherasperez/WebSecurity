import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/VulnerableShop.css';

const RETOS = [
  { id: 2, nombre: 'Detalles de producto oculto', descripcion: 'Has accedido al detalle de un producto oculto usando SQLi.' }
];

const ProductoDetalle = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [detalle, setDetalle] = useState(null);
  const [error, setError] = useState('');
  const [retoCompletado, setRetoCompletado] = useState(null);

  const id = searchParams.get('id');

  useEffect(() => {
    if (!id) {
      setError('No se ha especificado un ID de producto.');
      return;
    }
    const fetchDetalle = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_VULNERABLE_URL}/vulnerable-producto?id=${id}`);
        setDetalle(res.data);
        setError('');
        // Detectar reto 2: detalle de producto oculto
        if (res.data && res.data.categoria === "Oculta") {
          setRetoCompletado(2);
        }
      } catch {
        setError('No se pudo cargar el detalle.');
        setDetalle(null);
      }
    };
    fetchDetalle();
  }, [id]);

  const getProductImage = (prod) => prod?.imagen || `https://picsum.photos/300/200?grayscale&blur=2`;

  return (
    <div className="vshop-container">
      <header className="vshop-header">
        <span className="vshop-logo">🛒</span>
        <span className="vshop-title">WebSec Shop</span>
        <span className="vshop-vuln">(Vulnerable a SQLi)</span>
      </header>
      <section className="vshop-section">
        <button className="vshop-btn" onClick={() => navigate(-1)} style={{ marginBottom: 18 }}>
          Volver al catálogo
        </button>
        <h3>Detalle de producto</h3>
        {error && <div className="vshop-error">{error}</div>}
        {detalle && (
          <div className="vshop-product" style={{ maxWidth: 350, margin: '0 auto' }}>
            <div className="vshop-product-img-wrap">
              <img
                src={getProductImage(detalle)}
                alt={detalle.nombre}
                className="vshop-product-img"
                loading="lazy"
                onError={e => { e.target.src = "https://picsum.photos/300/200?grayscale&blur=2"; }}
              />
            </div>
            <div className="vshop-product-name">{detalle.nombre}</div>
            <div className="vshop-product-cat">{detalle.categoria}</div>
            <div className="vshop-product-price">{detalle.precio} €</div>
            <div className="vshop-product-stock">Stock: {detalle.stock}</div>
            <div style={{ marginTop: 16, fontSize: '0.95rem', color: '#888' }}>
              <strong>Tip:</strong> Puedes modificar el parámetro <code>id</code> en la URL para probar la vulnerabilidad.
            </div>
          </div>
        )}
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

export default ProductoDetalle;