import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Keep or modify default styling

ReactDOM.createRoot(document.getElementById('react-app-root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);