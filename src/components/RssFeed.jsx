import { useMemo } from 'react'
import { useRssFeed } from '../hooks/useRssFeed'

function formatDate(dateValue) {
  if (!dateValue) return 'Sin fecha'

  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) return 'Sin fecha'

  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function LoadingState() {
  return (
    <ul className="rss-list rss-list--loading" aria-label="Cargando noticias">
      {[1, 2, 3, 4].map((item) => (
        <li key={item} className="rss-item rss-item--skeleton">
          <div className="skeleton-line skeleton-line--short" />
          <div className="skeleton-line" />
          <div className="skeleton-line skeleton-line--small" />
        </li>
      ))}
    </ul>
  )
}

export function RssFeed() {
  const { articles, status, error, refresh, lastUpdate, sourceName, sourceUrl } = useRssFeed(6)
  const updateLabel = useMemo(() => formatDate(lastUpdate), [lastUpdate])

  return (
    <section className="section-shell content-section">
      <header className="section-heading">
        <h2>Actualidad en tiempo real (RSS)</h2>
        <button className="refresh-button" type="button" onClick={refresh}>
          Actualizar RSS
        </button>
      </header>

      <p className="rss-source">
        Fuente: <a href={sourceUrl}>{sourceName}</a> | Actualizado: {updateLabel}
      </p>

      {status === 'loading' && <LoadingState />}

      {status === 'error' && (
        <div className="rss-error" role="status">
          <p>{error}</p>
          <button className="button button--primary" type="button" onClick={refresh}>
            Reintentar
          </button>
        </div>
      )}

      {status === 'success' && (
        <ul className="rss-list">
          {articles.map((article) => (
            <li key={article.id} className="rss-item">
              <p className="story-category">Actualidad</p>
              <h3>{article.title}</h3>
              <p className="rss-item__description">{article.description}</p>
              <div className="rss-item__footer">
                <time dateTime={article.date}>{formatDate(article.date)}</time>
                <a href={article.link} target="_blank" rel="noreferrer">
                  Leer noticia
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

