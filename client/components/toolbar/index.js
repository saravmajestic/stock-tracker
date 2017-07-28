import React from 'react';
import { Link } from 'react-router-dom';
import './toolbar.scss';

export default () => (
  <nav className="navbar" role="navigation">
    <Link to="/">Home</Link>
    <Link to="/signin">Signin</Link>
    <Link to="/about">About</Link>
  </nav>
);
