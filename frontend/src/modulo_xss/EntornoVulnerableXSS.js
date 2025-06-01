import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/EntornoVulnerableXSS.css';
import { desbloquearLogro } from '../services/logroService';
import ModalLogroDesbloqueado from '../components/ModalLogroDesbloqueado';

// Modal simple reutilizable
const ModalExito = ({ mensaje, onClose }) => (
  <div className="vshop-modal-overlay" onClick={onClose}>
    <div className="vshop-modal" onClick={e => e.stopPropagation()} style={{ position: 'relative' }}>
      <button
        className="vshop-modal-close"
        onClick={onClose}
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
      <h3 className="vshop-modal-title">¡Ejercicio completado!</h3>
      <p>{mensaje}</p>
    </div>
  </div>
);

// Obtiene el nivel desde props o localStorage
const getNivel = (nivelProp) => {
  if (nivelProp) return nivelProp;
  return localStorage.getItem('nivelXSS') || 'facil';
};

// Función de sanitización según nivel
function sanitizeXSS(text, nivel) {
  if (nivel === 'facil') {
    // No sanitiza nada
    return text;
  } else if (nivel === 'medio') {
    // Elimina solo <script> pero permite otros vectores
    return text.replace(/<\s*script.*?>.*?<\s*\/\s*script\s*>/gi, '');
  } else if (nivel === 'dificil') {
    // Escapa caracteres HTML básicos (pero permite eventos y URLs peligrosas)
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return text.replace(/[&<>"']/g, m => map[m]);
  } else { // imposible
    // Sanitización robusta: elimina todas las etiquetas HTML (solo texto plano)
    return text.replace(/<[^>]*>?/gm, '');
  }
}

const EntornoVulnerableXSS = ({ nivel }) => {
  const nivelFinal = getNivel(nivel);

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [search, setSearch] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [comentarios, setComentarios] = useState({}); // { productoId: [comentario, ...] }
  const [nuevoComentario, setNuevoComentario] = useState({}); // { productoId: texto }

  // Estado para modales de ejercicios completados
  const [ejercicio1Completado, setEjercicio1Completado] = useState(
    localStorage.getItem('xssEj1Completado') === 'true'
  );
  const [ejercicio2Completado, setEjercicio2Completado] = useState(
    localStorage.getItem('xssEj2Completado') === 'true'
  );
  const [modalMensaje, setModalMensaje] = useState(null);

  // Estado para modal de logro desbloqueado
  const [logroDesbloqueado, setLogroDesbloqueado] = useState(null);

  // Cargar productos y categorías del backend al montar
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        let url = `${process.env.REACT_APP_VULNERABLE_URL}/vulnerable-productos?search=${encodeURIComponent(search)}`;
        if (categoriaSeleccionada) {
          url += `&categoria=${encodeURIComponent(categoriaSeleccionada)}`;
        }
        const res = await axios.get(url);
        setProductos(res.data.productos || []);
      } catch {
        setProductos([]);
      }
    };
    fetchProductos();
  }, [search, categoriaSeleccionada]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_VULNERABLE_URL}/vulnerable-categorias`);
        setCategorias(res.data || []);
      } catch {
        setCategorias([]);
      }
    };
    fetchCategorias();
  }, []);

  // Simular imágenes de productos
  const getProductImage = (prod) => prod.imagen || `https://picsum.photos/300/200?grayscale&blur=2`;

  // Detectar XSS reflejado (ejercicio 1)
useEffect(() => {
  if (!ejercicio1Completado) {
    if (
      /<script.*?>.*?<\/script>/i.test(search) ||
      /onerror\s*=/i.test(search) ||
      /<img[^>]+onerror\s*=/i.test(search)
    ) {
      setEjercicio1Completado(true);
      localStorage.setItem('xssEj1Completado', 'true');
      setModalMensaje('¡Has completado el ejercicio de XSS reflejado! Has conseguido ejecutar código JavaScript a través del campo de búsqueda.');

      // Desbloquear logro "XSS Hunter" al completar el ejercicio 1
      (async () => {
        try {
          const token = localStorage.getItem('authToken');
          const resLogro = await desbloquearLogro(token, "XSS Hunter");
          if (resLogro) {
            setLogroDesbloqueado(resLogro);
          }
        } catch {}
      })();
    }
  }
}, [search, ejercicio1Completado]);

  // Detectar XSS almacenado (ejercicio 2)
  useEffect(() => {
    if (!ejercicio2Completado) {
      // Busca en todos los comentarios si hay un payload típico de XSS
      const todosComentarios = Object.values(comentarios).flat();
      if (
        todosComentarios.some(
          c =>
            /<script.*?>.*?<\/script>/i.test(c) ||
            /onerror\s*=\s*["']?alert/i.test(c) ||
            /<img\s+[^>]*onerror\s*=/i.test(c)
        )
      ) {
        setEjercicio2Completado(true);
        localStorage.setItem('xssEj2Completado', 'true');
        setModalMensaje('¡Has completado el ejercicio de XSS almacenado! Has conseguido ejecutar código JavaScript a través de los comentarios.');
      }
    }
  }, [comentarios, ejercicio2Completado]);

  return (
    <div className="xss-entorno-container">
      <h2>Tienda vulnerable a XSS</h2>

      {/* Búsqueda vulnerable (reflejado) */}
      <div className="vshop-toolbar" style={{ marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Buscar producto (prueba XSS reflejado)"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="vshop-search"
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
      </div>
      <div
        style={{ margin: '10px 0', background: '#fff', padding: 8, borderRadius: 6 }}
        dangerouslySetInnerHTML={{ __html: `Resultados para: <b>${sanitizeXSS(search, nivelFinal)}</b>` }}
      />

      <hr />

      {/* Listado de productos */}
      <div className="vshop-grid">
        {productos.map(prod => (
          <div
            key={prod.id}
            className="vshop-product"
            style={{ background: '#fff', margin: '18px 0', padding: 16, borderRadius: 8, minWidth: 260 }}
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
            {/* Comentarios vulnerables */}
            <form
              onSubmit={e => {
                e.preventDefault();
                setComentarios({
                  ...comentarios,
                  [prod.id]: [
                    ...(comentarios[prod.id] || []),
                    nuevoComentario[prod.id] || ''
                  ]
                });
                setNuevoComentario({ ...nuevoComentario, [prod.id]: '' });
              }}
              style={{ marginTop: 12 }}
            >
              <label>Deja un comentario:</label>
              <input
                type="text"
                value={nuevoComentario[prod.id] || ''}
                onChange={e => setNuevoComentario({ ...nuevoComentario, [prod.id]: e.target.value })}
                style={{ width: '100%', marginBottom: 8 }}
              />
              <button type="submit">Comentar</button>
            </form>
            <ul style={{ marginTop: 10 }}>
              {(comentarios[prod.id] || []).map((c, i) => (
                <li key={i}>
                  <span dangerouslySetInnerHTML={{ __html: sanitizeXSS(c, nivelFinal) }} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {productos.length === 0 && <div className="vshop-empty">No hay productos para mostrar.</div>}

      {/* Modal de ejercicio completado */}
      {modalMensaje && (
        <ModalExito
          mensaje={modalMensaje}
          onClose={() => setModalMensaje(null)}
        />
      )}
      {/* Modal de logro desbloqueado */}
      {logroDesbloqueado && (
        <ModalLogroDesbloqueado
          logro={logroDesbloqueado}
          onClose={() => setLogroDesbloqueado(null)}
        />
      )}
    </div>
  );
};

export default EntornoVulnerableXSS;