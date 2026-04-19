import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTeamBadges } from '../hooks/useTeamBadges'
import { getTeamBadgeFallback } from '../services/teamBadgeService'

function Team({ name, badge, alt }) {
  return (
    <div className="team-pill">
      <img src={badge} alt={alt} width="50" height="50" />
      <span>{name}</span>
    </div>
  )
}

function formatDate(dateValue) {
  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateValue))
}

function getCountdownLabel(dateValue) {
  const now = Date.now()
  const target = new Date(dateValue).getTime()
  const diff = target - now

  if (diff <= 0) return 'En juego'

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)

  return `${days}d ${hours}h ${minutes}m`
}

export function MatchCenter({ match }) {
  const countdown = useMemo(() => getCountdownLabel(match.date), [match.date])
  const badgeMap = useTeamBadges([match.homeTeam.name, match.awayTeam.name])

  return (
    <section id="partidos" className="section-shell content-section">
      <header className="section-heading">
        <h2>Proximo partido</h2>
        <Link className="section-link" to="/calendario">
          Ver calendario completo
        </Link>
      </header>

      <article className="match-card">
        <p className="match-card__meta">
          {match.competition} - {match.matchday}
        </p>

        <div className="match-card__teams">
          <Team
            badge={badgeMap[match.homeTeam.name] || match.homeTeam.badge || getTeamBadgeFallback(match.homeTeam.name)}
            name={match.homeTeam.name}
            alt={`Escudo ${match.homeTeam.name}`}
          />

          <div className="match-card__info">
            <p className="match-card__day">{formatDate(match.date)}</p>
            <p className="match-card__time">{countdown}</p>
            <p className="match-card__stadium">{match.venue}</p>
          </div>

          <Team
            badge={badgeMap[match.awayTeam.name] || match.awayTeam.badge || getTeamBadgeFallback(match.awayTeam.name)}
            name={match.awayTeam.name}
            alt={`Escudo ${match.awayTeam.name}`}
          />
        </div>

        <div className="match-context-grid">
          <div>
            <p className="match-context-grid__label">Posesion media</p>
            <p className="match-context-grid__value">{match.context.possession}</p>
          </div>
          <div>
            <p className="match-context-grid__label">Tiros a puerta</p>
            <p className="match-context-grid__value">{match.context.shotsOnTarget}</p>
          </div>
          <div>
            <p className="match-context-grid__label">Porterias a cero</p>
            <p className="match-context-grid__value">{match.context.cleanSheets}</p>
          </div>
        </div>

        <div className="match-card__actions">
          <Link className="button button--light" to="/tienda">
            Ver tienda del club
          </Link>
          <Link className="button button--ghost" to="/actualidad">
            Ver previa
          </Link>
        </div>
      </article>
    </section>
  )
}
