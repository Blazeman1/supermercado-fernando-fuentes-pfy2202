// Contenedor base con borde, fondo y sombra (clase .tarjeta de index.css).
// "as" permite elegir la etiqueta semántica: section, article, li, aside, form...
export default function Tarjeta({ as = 'div', className = '', children, ...props }) {
  const Etiqueta = as; // JSX necesita un nombre con mayúscula para etiquetas dinámicas
  return (
    <Etiqueta className={`tarjeta ${className}`.trim()} {...props}>
      {children}
    </Etiqueta>
  );
}
