import React from 'react';
import './css/ModalLogroDesbloqueado.css';

const ModalLogroDesbloqueado = ({ logro, onClose }) => (
  <div className="modal-logro-overlay" onClick={onClose}>
    <div className="modal-logro" onClick={e => e.stopPropagation()}>
      <button className="modal-logro-close" onClick={onClose} aria-label="Cerrar">
        &times;
      </button>
      <h2>¡Logro desbloqueado!</h2>
      <div style={{ fontWeight: 600, margin: '12px 0' }}>{logro.nombre}</div>
      <div>{logro.descripcion}</div>
      {logro.icono && (
        <img
          src={`data:image/png;base64,${logro.icono}`}
          alt={logro.nombre}
          style={{ height: 36, width: 36, marginTop: 16, objectFit: 'contain' }}
        />
      )}
    </div>
  </div>
);

export default ModalLogroDesbloqueado;