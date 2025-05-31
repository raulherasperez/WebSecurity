import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/SandboxShop.css';

const API_URL = process.env.REACT_APP_VULNERABLE_URL;

const SandboxProductDetail = ({ user }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [detalle, setDetalle] = useState(null);
  const [error, setError] = useState('');
  const [review, setReview] = useState('');
  const [autor, setAutor] = useState(user ? user.nombre : 'Anónimo');
  const [message, setMessage] = useState('');
  const [reviews, setReviews] = useState([]);

  const id = searchParams.get('id');

  useEffect(() => {
    if (!id) {
      setError('No se ha especificado un ID de producto.');
      return;
    }
    const fetchDetalle = async () => {
      try {
        const res = await axios.get(`${API_URL}/sandbox/producto/${id}`);
        setDetalle(res.data.producto);
        setReviews(res.data.reviews || []);
        setError('');
      } catch {
        setError('No se pudo cargar el detalle.');
        setDetalle(null);
      }
    };
    fetchDetalle();
    // eslint-disable-next-line
  }, [id]);

  const handleReview = async e => {
    e.preventDefault();
    setMessage('');
    try {
      await axios.post(`${API_URL}/sandbox/producto/${id}/review`, { autor, texto: review });
      setReviews([{ autor, texto: review, fecha: new Date().toISOString() }, ...reviews]);
      setReview('');
      setMessage('¡Review enviada!');
    } catch {
      setMessage('Error al enviar review');
    }
  };

  const getProductImage = (prod) => prod?.imagen || `https://picsum.photos/300/200?grayscale&blur=2`;

  return (
    <div className="sandbox-product-detail-page">
      <button className="sandbox-btn" onClick={() => navigate(-1)} style={{ marginBottom: 18 }}>
        Volver al catálogo
      </button>
      <h3>Detalle de producto</h3>
      {error && <div className="sandbox-review-msg">{error}</div>}
      {detalle && (
        <div className="sandbox-product" style={{ maxWidth: 350, margin: '0 auto' }}>
          <div className="sandbox-product-img-wrap">
            <img
              src={getProductImage(detalle)}
              alt={detalle.nombre}
              className="sandbox-product-img"
              loading="lazy"
              onError={e => { e.target.src = "https://picsum.photos/300/200?grayscale&blur=2"; }}
            />
          </div>
          <div className="sandbox-product-name">{detalle.nombre}</div>
          <div className="sandbox-product-price">{detalle.precio} €</div>
          <div className="sandbox-product-stock">Stock: {detalle.stock}</div>
          <div className="sandbox-detail-desc">{detalle.descripcion}</div>
        </div>
      )}
      <div className="sandbox-reviews-section">
        <div className="sandbox-reviews-title">Opiniones de clientes</div>
        <form onSubmit={handleReview} className="sandbox-review-form">
          <input
            value={autor}
            onChange={e => setAutor(e.target.value)}
            placeholder="Autor"
            className="sandbox-review-autor"
          />
          <textarea
            value={review}
            onChange={e => setReview(e.target.value)}
            placeholder="Escribe tu review..."
            required
            className="sandbox-review-text"
          />
          <button type="submit" className="sandbox-review-btn">Enviar review</button>
        </form>
        {message && <p className="sandbox-review-msg">{message}</p>}
        <ul className="sandbox-review-list">
          {reviews.map((r, i) => (
            <li key={i} className="sandbox-review-item">
              <div className="sandbox-review-avatar">
                {r.autor?.[0]?.toUpperCase() || "?"}
              </div>
              <div className="sandbox-review-content">
                <span className="sandbox-review-author">{r.autor}</span>
                <span className="sandbox-review-date">
                  {r.fecha?.slice(0, 16).replace("T", " ") || ""}
                </span>
                <div
                  className="sandbox-review-text-content"
                  dangerouslySetInnerHTML={{ __html: r.texto }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SandboxProductDetail;