import { BrowserRouter } from 'react-router-dom';
import TiendaProvider from './context/TiendaProvider';
import AppRoutes from './routes/AppRoutes';

// basename: en GitHub Pages el sitio vive en /supermercado-fernando-fuentes-pfy2202/.
// Vite entrega ese prefijo en import.meta.env.BASE_URL ("/" en desarrollo),
// y el router lo antepone a todas las rutas.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <TiendaProvider>
        <AppRoutes />
      </TiendaProvider>
    </BrowserRouter>
  );
}
