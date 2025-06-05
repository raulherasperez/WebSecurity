import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import MDEditor from '@uiw/react-md-editor';
import './css/GuiaCrear.css';
import { useAuth } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const GuiaEditar = () => {
  const { id } = useParams();
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');
  const fileInputRef = useRef();
  const editorRef = useRef();
  const { user } = useAuth();
  const username = user?.username;



  useEffect(() => {
    const fetchGuia = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/guias/${id}`);
        if (res.data.usuario?.username !== username) {
          setError('No tienes permiso para editar esta guía.');
        } else {
          setTitulo(res.data.titulo);
          setContenido(res.data.contenido);
        }
      } catch {
        setError('No se pudo cargar la guía.');
      } finally {
        setLoading(false);
      }
    };
    fetchGuia();
  }, [id, username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await axios.put(
        `${API_URL}/api/guias/${id}`,
        { titulo, contenido },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      navigate(`/guias/${id}`);
    } catch {
      setMessage('No se pudo actualizar la guía.');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(`${API_URL}/api/upload/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
      });
      const url = res.data;
      const editor = editorRef.current;
      if (editor && editor.textarea) {
        const textarea = editor.textarea;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const before = contenido.slice(0, start);
        const after = contenido.slice(end);
        const markdownImage = `![imagen](${url})`;
        setContenido(before + markdownImage + after);
        setTimeout(() => {
          textarea.focus();
          textarea.selectionStart = textarea.selectionEnd = start + markdownImage.length;
        }, 0);
      } else {
        setContenido(contenido + `\n\n![imagen](${url})\n`);
      }
    } catch {
      alert('Error subiendo la imagen');
    }
  };

  if (loading) return <div className="guia-detalle-loading">Cargando...</div>;
  if (error) return (
    <div className="guia-detalle-error">
      {error}
      <div style={{ marginTop: 16 }}>
        <Link to={`/guias/${id}`}>Volver a la guía</Link>
      </div>
    </div>
  );

  return (
    <div className="guia-crear-container">
      <h2>Editar guía</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Título:</label>
          <input
            type="text"
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
            required
            className="guia-crear-titulo"
          />
        </div>
        <div>
          <label>Contenido:</label>
          <div style={{ marginBottom: 8 }}>
            <button
              type="button"
              className="guia-crear-img-btn"
              onClick={() => fileInputRef.current.click()}
            >
              Subir imagen
            </button>
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
          </div>
          <MDEditor
            ref={editorRef}
            value={contenido}
            onChange={setContenido}
            height={300}
            className="guia-crear-editor"
          />
        </div>
        <button type="submit" className="guia-crear-btn">Guardar cambios</button>
        {message && <p className="guia-crear-error">{message}</p>}
      </form>
    </div>
  );
};

export default GuiaEditar;