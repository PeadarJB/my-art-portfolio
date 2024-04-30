import React from 'react';
import { createRoot } from 'react-dom/client'; // Update the import to use createRoot
import App from './App';
import './styles/styles.scss'; // Continue to import your SCSS for global styles

// Access the container where the React application will mount
const container = document.getElementById('root');

// Create a root instance on the container
const root = createRoot(container); 

// Render your App component into the root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);