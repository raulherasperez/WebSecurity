import React from 'react';
import { Link } from 'react-router-dom';
import './css/Footer.css';

const Footer = () => (
  <footer className="app-footer">
    <div className="footer-links">
      <Link to="/reportes" className="footer-link">Reportar error</Link>
      <Link to="/sugerencias" className="footer-link">Sugerencias</Link>
    </div>
    <div className="footer-info">
      © {new Date().getFullYear()} WebSecurity. Todos los derechos reservados.
    </div>
  </footer>
);

export default Footer;