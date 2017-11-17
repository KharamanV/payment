import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import CSSModules from 'react-css-modules';
import Home from '../Header';
import styles from './styles.css';

const App = () => (
  <Router>
    <div className="app">
      <Home />
    </div>
  </Router>
);

export default CSSModules(App, styles);
