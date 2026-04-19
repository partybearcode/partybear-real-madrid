import { Link } from 'react-router-dom'

export function NewsHighlights({ items }) {
  return (
    <section id="actualidad" className="section-shell content-section">
      <header className="section-heading">
        <h2>Noticias destacadas</h2>
        <Link className="section-link" to="/actualidad">
          Ver todas
        </Link>
      </header>

      <div className="news-grid">
        {items.map((item) => (
          <article key={item.title} className="news-card">
            <img className="news-card__image" src={item.image} alt={item.title} loading="lazy" />
            <div className="news-card__content">
              <p className="story-category">{item.category}</p>
              <h3>{item.title}</h3>
              <Link className="story-link" to={item.href}>
                Acceder
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
