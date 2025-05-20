import React from 'react';
import { Link } from 'react-router-dom';
import './css/LogoHomeLink.css';

const LogoHomeLink = () => {
  return (
    <div className="logo-home-link">
      <Link to="/">
        <h1>Web Security</h1>
      </Link>
    </div>
  );
};

export default LogoHomeLink;