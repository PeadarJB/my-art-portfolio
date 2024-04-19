import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; 
import './styles/styles.scss'; // Import your SCSS file for global styles

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);