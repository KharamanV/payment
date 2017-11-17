import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.css';

const Header = () => (
  <ul styleName="header">
    <li>Home</li>
  </ul>
);

export default CSSModules(Header, styles);
