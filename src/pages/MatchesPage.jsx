import { MatchCenter } from '../components/MatchCenter'
import { PageHero } from '../components/common/PageHero'
import { featuredMatch } from '../data/matches'

export function MatchesPage() {
  return (
    <>
      <PageHero
        eyebrow="Partidos"
        title="Centro de partido"
        description="Previa del siguiente encuentro, contexto deportivo y acciones rapidas."
      />
      <MatchCenter match={featuredMatch} />

      <section className="section-shell content-section">
        <article className="info-banner">
          <h2>Estado competitivo</h2>
          <p>
            El bloque mantiene una media alta en recuperacion tras perdida y un ritmo estable de ocasiones por
            partido.
          </p>
        </article>
      </section>
    </>
  )
}

