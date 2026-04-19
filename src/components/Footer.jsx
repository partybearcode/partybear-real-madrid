import { Link } from 'react-router-dom'

export function Footer({ sponsors, footerColumns }) {
  return (
    <footer id="club" className="site-footer">
      <section className="section-shell sponsors-bar" aria-label="Patrocinadores destacados">
        {sponsors.map((sponsor) => (
          <img
            key={sponsor.name}
            className="sponsor-logo"
            src={sponsor.image}
            alt={sponsor.name}
            loading="lazy"
          />
        ))}
      </section>

      <section className="section-shell footer-main">
        <div className="footer-grid">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3>{column.title}</h3>
              <ul>
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="footer-copy">(c) Real Madrid C.F. - Proyecto academico en React con arquitectura modular.</p>
      </section>
    </footer>
  )
}
