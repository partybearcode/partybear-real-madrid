import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="section-shell page-not-found">
      <p className="page-hero__eyebrow">404</p>
      <h1 className="page-hero__title">Pagina no encontrada</h1>
      <p className="page-hero__description">La ruta que intentas abrir no existe en esta web.</p>
      <Link className="button button--primary" to="/">
        Volver al inicio
      </Link>
    </section>
  )
}
