import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTeamBadges } from '../hooks/useTeamBadges'

const allFilters = [
  { id: 'all', label: 'Todo' },
  { id: 'futbol', label: 'Futbol' },
  { id: 'baloncesto', label: 'Baloncesto' },
]

function formatCalendarDate(dateValue) {
  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateValue))
}

function CompetitionFilter({ options, value, onChange }) {
  return (
    <label className="calendar-select">
      Competicion
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="all">Todas</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

function MatchupWithBadges({ fixture, badgeMap }) {
  return (
    <div className="calendar-matchup">
      <div className="calendar-team">
        <img src={badgeMap[fixture.homeTeam]} alt={fixture.homeTeam} loading="lazy" />
        <span>{fixture.homeTeam}</span>
      </div>
      <strong>vs</strong>
      <div className="calendar-team">
        <img src={badgeMap[fixture.awayTeam]} alt={fixture.awayTeam} loading="lazy" />
        <span>{fixture.awayTeam}</span>
      </div>
    </div>
  )
}

export function MatchCalendar({
  fixtures,
  isAuthenticated = false,
  savedMatchIds = [],
  savingMatchId = '',
  onToggleSave = null,
}) {
  const [teamType, setTeamType] = useState('all')
  const [competition, setCompetition] = useState('all')

  const competitionOptions = useMemo(
    () => Array.from(new Set(fixtures.map((fixture) => fixture.competition))),
    [fixtures],
  )

  const filteredFixtures = useMemo(
    () =>
      fixtures.filter((fixture) => {
        const teamMatch = teamType === 'all' ? true : fixture.teamType === teamType
        const competitionMatch = competition === 'all' ? true : fixture.competition === competition

        return teamMatch && competitionMatch
      }),
    [competition, fixtures, teamType],
  )

  const teamNames = useMemo(
    () => filteredFixtures.flatMap((fixture) => [fixture.homeTeam, fixture.awayTeam]),
    [filteredFixtures],
  )
  const badgeMap = useTeamBadges(teamNames)

  return (
    <section id="calendario" className="section-shell content-section">
      <header className="section-heading">
        <h2>Calendario de partidos</h2>
      </header>

      <div className="calendar-toolbar">
        <div className="calendar-chip-list" role="tablist" aria-label="Filtro por seccion">
          {allFilters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              role="tab"
              aria-selected={teamType === filter.id}
              className={`calendar-chip ${teamType === filter.id ? 'calendar-chip--active' : ''}`}
              onClick={() => setTeamType(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <CompetitionFilter options={competitionOptions} value={competition} onChange={setCompetition} />
      </div>

      <div className="calendar-list">
        {filteredFixtures.map((fixture) => (
          <article key={fixture.id} className="calendar-row">
            <div className="calendar-row__meta">
              <p>{fixture.competition}</p>
              <span>{fixture.status}</span>
            </div>

            <div className="calendar-row__matchup">
              <MatchupWithBadges fixture={fixture} badgeMap={badgeMap} />
              <span>{fixture.venue}</span>
            </div>

            <div className="calendar-row__side">
              <p className="calendar-row__date">{formatCalendarDate(fixture.date)}</p>
              {isAuthenticated ? (
                <button
                  type="button"
                  className={`calendar-save ${savedMatchIds.includes(fixture.id) ? 'calendar-save--active' : ''}`}
                  onClick={() => onToggleSave?.(fixture)}
                  disabled={savingMatchId === fixture.id}
                >
                  {savingMatchId === fixture.id ? 'Guardando...' : savedMatchIds.includes(fixture.id) ? 'Guardado' : 'Guardar'}
                </button>
              ) : (
                <Link className="calendar-login-link" to="/club">
                  Accede para guardar
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

