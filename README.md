# Mercado Austral — Gestión de inventario

Proyecto del curso **Desarrollo Frontend II (PFY2202)** · Duoc UC · Forma B (supermercado)
**Autor:** Fernando Fuentes Allende

**Sitio publicado (GitHub Pages):** https://blazeman1.github.io/supermercado-fernando-fuentes-pfy2202/

SPA (Single Page Application) de gestión de inventario con carrito de compras, construida con **React 19**, **React Router v6**, estado global con **useReducer + Context API** y estilos con **Tailwind CSS v3**.

| Entrega | Actividad | Referencia en git |
|---|---|---|
| Semana 1 | Formativa 1 — Navegación con React Router | tag `entrega-s1` |
| Semana 2 | Formativa 2 — Estado global y framework CSS | tag `entrega-s2` |
| **Semana 3** | **Sumativa — Filtro, detalle, carrito y publicación** | rama `main` |

---

## Semana 3 — Desarrollando sitios web con React avanzado

### Requisitos y criterios de evaluación

| # | Criterio | Implementación |
|---|---|---|
| 1 | **Pantalla de listado** con todos los elementos del inventario | `/articulos` (`pages/ListadoArticulos.jsx` + `components/inventario/TablaArticulos.jsx`): SKU, nombre, marca, categoría, precio, stock disponible, unidades en carrito y estado. Tabla ordenable en escritorio y tarjetas en móvil. |
| 2 | **Filtro por categoría** con actualización dinámica, sin afectar los datos originales | `components/inventario/FiltroCategorias.jsx` + `utils/inventario.js`. La categoría seleccionada es estado (en la URL, vía `useSearchParams`); la lista visible se **deriva** con `filtrarArticulos()`, que devuelve un arreglo nuevo. El inventario global nunca se modifica, y los conteos por categoría siguen mostrando el total. Probado en `utils/inventario.test.js`. |
| 3 | **Pantalla de detalle** al hacer clic en un artículo, con opción de agregar al carrito | `/articulos/:sku` (`pages/DetalleArticulo.jsx`): fila o tarjeta clicable, selector de cantidad limitado al stock, botón "Agregar al carrito" que **descuenta del inventario**, aviso con enlace al carrito y bloqueo si el artículo está agotado. |
| 4 | **Carrito**: aumentar/disminuir cantidades actualizando el inventario | `/carrito` (`pages/Carrito.jsx`, `components/carrito/*`): `+` y `−` mueven unidades entre carrito e inventario; además Quitar, Vaciar (devuelve todo el stock) y Confirmar compra (mantiene el descuento). Probado en `context/tiendaReducer.test.js`. |
| 5 | **Framework CSS** consistente y responsive | Tailwind CSS: tema propio en `tailwind.config.js`, componentes con `@apply` en `index.css`, prefijos `sm:` `md:` `lg:` en todas las pantallas (verificado sin scroll horizontal a 390 px). |
| 6 | **Código modular y reutilizable** | Carpetas por responsabilidad (ver *Estructura*); componentes UI genéricos (`Boton` con variantes, `Tarjeta`, `SelectorCantidad`, `EncabezadoPagina`, `Aviso`, `EstadoVacio`) usados en todas las páginas; lógica pura separada en `utils/` y `context/`. |
| 7 | **Publicación en GitHub** con documentación y **gh-pages** | Este README, rama `gh-pages` generada con `npm run deploy` y sitio en GitHub Pages (ver *Despliegue*). |

### Diseño del estado global

Inventario y carrito viven en **un solo `useReducer`** (`context/tiendaReducer.js`), porque sus cambios son interdependientes: agregar al carrito *resta* del inventario. Con una única acción, ambos se actualizan juntos y nunca quedan desalineados.

```
estado = {
  articulos: [{ sku, nombre, marca, tipo, precio, stock, stockMinimo }],
  carrito:   [{ sku, cantidad }]        ← solo referencias (estado normalizado)
}

Invariante: stock + cantidad en carrito = constante al mover unidades
```

| Acción | Efecto en el inventario | Efecto en el carrito |
|---|---|---|
| `AGREGAR_AL_CARRITO` | `stock − n` (máximo: el stock disponible) | `cantidad + n` |
| `CAMBIAR_CANTIDAD` (+1 / −1) | `stock ∓ 1` | `cantidad ± 1`; se elimina al llegar a 0 |
| `QUITAR_DEL_CARRITO` | devuelve todas sus unidades | se elimina el ítem |
| `VACIAR_CARRITO` | devuelve todas las unidades | `[]` |
| `CONFIRMAR_COMPRA` | sin cambios (ya se descontó) | `[]` |
| `ELIMINAR` (artículo) | se elimina | también se quita del carrito |

Los componentes no usan `dispatch` directamente, sino dos hooks con responsabilidades separadas (`context/hooks.js`):

- `useInventario()` → `articulos`, `agregarArticulo`, `ajustarStock`, `eliminarArticulo`, `restablecer`
- `useCarrito()` → `items` (enriquecidos con los datos del artículo), `totalUnidades` y `total` (**derivados**, no guardados), `agregarAlCarrito`, `cambiarCantidad`, `quitarDelCarrito`, `vaciarCarrito`, `confirmarCompra`

El estado se persiste en `localStorage` (clave `tienda-mercado-austral-v3`) y migra automáticamente el inventario guardado de la semana 2.

### Buenas prácticas aplicadas (guía de la semana 3)

| Práctica | Dónde |
|---|---|
| Archivo central de rutas | `src/routes/AppRoutes.jsx` |
| Layout para rutas que comparten estructura | `components/layout/Layout.jsx` con `<Outlet />` |
| *Lazy loading* con `React.lazy` + `Suspense` | Todas las páginas en `AppRoutes.jsx`; `<Suspense fallback={<Cargando />}>` en `Layout` (Vite genera un archivo por página) |
| Rutas anidadas y parámetros dinámicos | `/articulos/:sku`, `/carrito/compra-exitosa`, `/contacto/enviado` |
| Estados separados por funcionalidad y alcance | Global: inventario y carrito. Local (`useState`): cantidad elegida en el detalle, campos de formularios. Filtros: en la URL. |
| Inmutabilidad | El reducer y las funciones de `utils/` siempre devuelven copias nuevas (probado con Vitest). |
| Estado derivado en vez de duplicado | Totales del carrito, conteos por categoría y lista filtrada se calculan con `useMemo`. |
| Clases reutilizables con `@apply` | `.btn-*`, `.campo`, `.tarjeta`, `.chip`, `.etiqueta` en `index.css` |
| Componentes UI con variantes | `ui/Boton.jsx` (`primario`, `secundario`, `peligro`, `fantasma`; tamaños `sm`, `md`, `lg`) |
| Tema de diseño en `tailwind.config.js` | Colores `marca-*` y `acento-*` |
| Variantes de estado | `hover:`, `focus:`, `disabled:`, `group-hover:` |
| Valores arbitrarios | `min-w-[3ch]`, `pb-[72px]`, `min-w-[760px]` |
| Purga de CSS no usado | `content` en `tailwind.config.js` (CSS final ≈ 23 kB) |

### Flujo de uso

1. **Listado de artículos** → elige una categoría (por ejemplo, *Lácteos*).
2. Haz clic en un artículo → **detalle** → elige la cantidad → **Agregar al carrito**. El stock disponible baja de inmediato.
3. **Carrito** (encabezado, con contador) → `+` / `−` por artículo; el inventario se actualiza en cada clic.
4. **Confirmar compra** (el stock queda descontado) o **Vaciar carrito** (todo vuelve al inventario).

---

## Estructura

```
├── tailwind.config.js            # Tema y rutas que Tailwind analiza
├── postcss.config.js             # Tailwind + Autoprefixer
├── vite.config.js                # base para GitHub Pages + 404.html (fallback SPA)
└── src/
    ├── main.jsx                  # Punto de entrada
    ├── App.jsx                   # BrowserRouter (basename) + TiendaProvider + rutas
    ├── index.css                 # @tailwind y componentes @layer/@apply
    ├── routes/
    │   └── AppRoutes.jsx         # Todas las rutas, páginas con lazy()
    ├── context/
    │   ├── tiendaReducer.js      # ACCIONES, reducer, persistencia
    │   ├── tiendaReducer.test.js # Pruebas del reducer (Vitest)
    │   ├── TiendaContext.js      # createContext
    │   ├── TiendaProvider.jsx    # useReducer + useEffect (localStorage)
    │   └── hooks.js              # useInventario() y useCarrito()
    ├── components/
    │   ├── layout/               # Layout, MenuInventario, MenuInferior, BotonCarrito
    │   ├── ui/                   # Boton, Tarjeta, EncabezadoPagina, SelectorCantidad,
    │   │                         # Aviso, EstadoVacio, Cargando (genéricos, sin lógica de negocio)
    │   ├── inventario/           # TablaArticulos, FiltroCategorias, EstadoStock, AjusteStock
    │   └── carrito/              # ItemCarrito, ResumenCarrito
    ├── pages/                    # Una página por ruta
    │   ├── Home.jsx  ListadoArticulos.jsx  DetalleArticulo.jsx  NuevoArticulo.jsx
    │   ├── Carrito.jsx  CompraExitosa.jsx
    │   └── NuestrasTiendas.jsx  Contactanos.jsx  ContactoEnviado.jsx  NoEncontrado.jsx
    ├── data/                     # Datos iniciales (productos, tiendas)
    └── utils/
        ├── formato.js            # Formato CLP y estado de stock
        ├── inventario.js         # filtrarArticulos, ordenarArticulos, contarPorCategoria
        └── inventario.test.js    # Pruebas del filtro (Vitest)
```

### Mapa de rutas

```
/                          Panel de inventario                    ← menú inferior
/articulos                 Listado con filtro por categoría       ← menú de inventario
/articulos/nuevo           Ingresar artículo (formulario)         ← menú de inventario
/articulos/:sku            Detalle + agregar al carrito
/carrito                   Carrito de compras                     ← botón del encabezado
/carrito/compra-exitosa    Confirmación (requiere location.state)
/tiendas                   Nuestras tiendas (?region=)            ← menú inferior
/contacto                  Contáctanos                            ← menú inferior
/contacto/enviado          Confirmación del formulario
/producto/:sku             Redirige a /articulos/:sku (enlaces de la semana 1)
/inicio                    Redirige a /
*                          Página no encontrada (404)
```

---

## Ejecución local

Requiere Node.js 18 o superior.

```bash
npm install
npm start          # o npm run dev → http://localhost:5173
npm test           # pruebas unitarias (Vitest)
npm run lint       # ESLint
npm run build      # compila a dist/
```

> El proyecto usa **Vite** en lugar de Create React App (descontinuado). React, React Router, `useReducer`, Context y Tailwind se usan igual que en las guías; `npm start` se mantiene como alias.

## Despliegue en GitHub Pages

```bash
npm run deploy     # compila (predeploy) y publica dist/ en la rama gh-pages
```

Configuración, una sola vez: en GitHub, **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `gh-pages` / `(root)`**.

Cómo funciona:

- `vite.config.js` usa `base: '/supermercado-fernando-fuentes-pfy2202/'` al compilar, porque el sitio vive en esa subcarpeta.
- `App.jsx` pasa ese mismo prefijo a `BrowserRouter` como `basename` (`import.meta.env.BASE_URL`).
- GitHub Pages no conoce las rutas de React Router. Al recargar `/carrito` respondería con un 404. Por eso el build copia `index.html` como `404.html`: GitHub sirve ese archivo, se carga la aplicación y React Router muestra la ruta correcta.

---

## Semana 2 — Gestión de estado y Tailwind CSS (resumen)

- **Nuevo menú** en el encabezado (`MenuInventario.jsx`): *Listado de artículos* e *Ingresar artículo*.
- **Estado global** con `useReducer` + Context; artículos con nombre, marca y categoría (tipo de producto).
- **Formulario** controlado con validación, SKU automático por categoría y vista previa en vivo (`NuevoArticulo.jsx`).
- **Tabla** con todos los artículos (`ListadoArticulos.jsx`).
- **Tailwind CSS v3** en todo el sitio.

## Semana 1 — Navegación con React Router (resumen)

- `BrowserRouter`, `Routes`/`Route`, rutas índice y anidadas, ruta de diseño con `<Outlet />`.
- **Menú inferior** con `NavLink` hacia *Nuestras tiendas* y *Contáctanos*.
- Ruta dinámica con `useParams`, navegación programática con `useNavigate`, paso de estado con `location.state`.
- Filtros en la URL con `useSearchParams`, redirecciones con `<Navigate />`, página 404 con `*`.
- `useLocation` para actualizar el título, el scroll y el foco en cada cambio de ruta (accesibilidad).
