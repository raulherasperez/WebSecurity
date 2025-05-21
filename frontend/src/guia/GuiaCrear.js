import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MDEditor from '@uiw/react-md-editor';
import './css/GuiaCrear.css';

const GuiaCrear = () => {
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');
  const fileInputRef = useRef();
  const editorRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await axios.post('http://localhost:8080/api/guias', {
        titulo,
        contenido
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      navigate('/guias');
    } catch (err) {
      setMessage('No se pudo crear la guía.');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:8080/api/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
         }
      });
      const url = res.data;
      // Insertar en la posición del cursor
      const editor = editorRef.current;
      if (editor && editor.textarea) {
        const textarea = editor.textarea;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const before = contenido.slice(0, start);
        const after = contenido.slice(end);
        const markdownImage = `![imagen](${url})`;
        setContenido(before + markdownImage + after);
        // Opcional: mover el cursor después de la imagen insertada
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

  return (
    <div className="guia-crear-container">
      <h2>Crear nueva guía</h2>
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
        <button type="submit" className="guia-crear-btn">Publicar guía</button>
        {message && <p className="guia-crear-error">{message}</p>}
      </form>
    </div>
  );
};

export default GuiaCrear;