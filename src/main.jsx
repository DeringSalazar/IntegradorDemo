import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css'; // <-- importa tu archivo de estilos
import { AbastecimientoProvider } from './context/contextoAbastecimiento.jsx'; // <-- importa tu provider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AbastecimientoProvider>
        <App />
      </AbastecimientoProvider>
    </BrowserRouter>
  </React.StrictMode>
);

