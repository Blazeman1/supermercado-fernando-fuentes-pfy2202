import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { InventarioProvider } from './context/InventarioContext';
import App from './App';
import './index.css';

// BrowserRouter envuelve toda la aplicación: usa la History API del
// navegador para que las URLs sean "limpias" (/tiendas, /contacto...).
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <InventarioProvider>
        <App />
      </InventarioProvider>
    </BrowserRouter>
  </StrictMode>
);
