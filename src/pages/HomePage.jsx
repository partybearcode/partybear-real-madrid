import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { featuredMatch, matchCalendar } from '../data/matches'
import { highlights, sideStories } from '../data/siteContent'
import { useTeamBadges } from '../hooks/useTeamBadges'
import { getTeamBadgeFallback } from '../services/teamBadgeService'
import './HomePage.css'

function formatMatchDate(value) {
  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function HomePage() {
  const pageRef = useRef(null)
  const heroRef = useRef(null)
  const [showPlayersLayer, setShowPlayersLayer] = useState(() => (
    typeof window === 'undefined' ? true : window.innerWidth > 520
  ))

  useEffect(() => {
    function handleViewport() {
      setShowPlayersLayer(window.innerWidth > 520)
    }

    handleViewport()
    window.addEventListener('resize', handleViewport)
    return () => window.removeEventListener('resize', handleViewport)
  }, [])

  useEffect(() => {
    const pageNode = pageRef.current
    const heroNode = heroRef.current
    if (!pageNode || !heroNode) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobileLayout = window.innerWidth <= 900
    if (reducedMotion || mobileLayout) {
      pageNode.style.setProperty('--hero-progress', '0')
      pageNode.style.setProperty('--hero-bg-shift', '0px')
      pageNode.style.setProperty('--hero-players-shift', '0px')
      pageNode.style.setProperty('--hero-title-shift', '0px')
      pageNode.style.setProperty('--hero-glass-blur', '14px')
      return
    }

    let raf = 0
    let current = 0
    let target = 0

    function setCss(progress) {
      const clamped = Math.max(0, Math.min(progress, 1.2))
      const bgShift = clamped * -90
      const playersShift = clamped * 28
      const titleShift = clamped * -190
      const glassBlur = 14 + clamped * 9
      const heroPinHeight = Math.max(window.innerHeight - 116, 620)
      const extraScroll = window.innerWidth >= 1440 ? window.innerHeight * 0.42 : window.innerHeight * 0.3
      const heroSectionHeight = Math.max(heroPinHeight + extraScroll, window.innerHeight * 1.22)

      pageNode.style.setProperty('--hero-progress', clamped.toFixed(4))
      pageNode.style.setProperty('--hero-bg-shift', `${bgShift.toFixed(2)}px`)
      pageNode.style.setProperty('--hero-players-shift', `${playersShift.toFixed(2)}px`)
      pageNode.style.setProperty('--hero-title-shift', `${titleShift.toFixed(2)}px`)
      pageNode.style.setProperty('--hero-glass-blur', `${glassBlur.toFixed(2)}px`)
      pageNode.style.setProperty('--hero-pin-height', `${heroPinHeight.toFixed(2)}px`)
      pageNode.style.setProperty('--hero-section-height', `${heroSectionHeight.toFixed(2)}px`)
    }

    function tick() {
      current += (target - current) * 0.12
      setCss(current)

      if (Math.abs(target - current) > 0.001) {
        raf = window.requestAnimationFrame(tick)
      } else {
        raf = 0
        current = target
        setCss(current)
      }
    }

    function schedule() {
      if (!raf) {
        raf = window.requestAnimationFrame(tick)
      }
    }

    function updateTarget() {
      const rect = heroNode.getBoundingClientRect()
      const absoluteTop = window.scrollY + rect.top
      const start = absoluteTop - window.innerHeight * 0.2
      const end = absoluteTop + rect.height - window.innerHeight * 0.8
      const raw = (window.scrollY - start) / Math.max(end - start, 1)
      target = Math.max(0, Math.min(raw, 1.2))

      schedule()
    }

    window.addEventListener('scroll', updateTarget, { passive: true })
    window.addEventListener('resize', updateTarget)
    updateTarget()

    return () => {
      window.removeEventListener('scroll', updateTarget)
      window.removeEventListener('resize', updateTarget)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [])

  const fixtures = matchCalendar.slice(0, 4)
  const stories = [...highlights, ...sideStories].slice(0, 3)
  const badgeMap = useTeamBadges([
    featuredMatch.homeTeam.name,
    featuredMatch.awayTeam.name,
    ...fixtures.flatMap((item) => [item.homeTeam, item.awayTeam]),
  ])

  return (
    <div ref={pageRef} className="art-home">
      <section ref={heroRef} className="art-hero">
        <div className="art-hero__pin">
          <img
            className="art-hero__bg"
            src="/media/hero_banner_desktop_14.jpg"
            alt="Panoramica nocturna del Santiago Bernabeu"
            fetchPriority="high"
            decoding="async"
          />
          <div className="art-hero__veil" aria-hidden="true" />
          <div className="art-hero__halo art-hero__halo--left" aria-hidden="true" />
          <div className="art-hero__halo art-hero__halo--right" aria-hidden="true" />

          <div className="art-hero__title-band" aria-hidden="true">
            <span>MATCHDAY</span>
            <strong>REAL MADRID</strong>
            <em>MOVIMIENTO Y GLORIA</em>
          </div>

          {showPlayersLayer && (
            <img
              className="art-hero__players"
              src="/media/hero_banner_desktop_14_no_bg.png"
              alt="Jugadores del Real Madrid en primer plano"
              decoding="async"
            />
          )}
        </div>
      </section>

      <section className="section-shell art-grid">
        <article className="art-card art-card--main">
          <header>
            <p>Proximo duelo</p>
            <h2>
              {featuredMatch.competition} | {featuredMatch.matchday}
            </h2>
          </header>

          <div className="art-matchup">
            <div>
              <img
                src={badgeMap[featuredMatch.homeTeam.name] || getTeamBadgeFallback(featuredMatch.homeTeam.name)}
                alt="Real Madrid"
              />
              <strong>{featuredMatch.homeTeam.name}</strong>
            </div>
            <span>VS</span>
            <div>
              <img
                src={badgeMap[featuredMatch.awayTeam.name] || getTeamBadgeFallback(featuredMatch.awayTeam.name)}
                alt={featuredMatch.awayTeam.name}
              />
              <strong>{featuredMatch.awayTeam.name}</strong>
            </div>
          </div>

          <p className="art-card__meta">{formatMatchDate(featuredMatch.date)} | {featuredMatch.venue}</p>
          <div className="art-links">
            <Link to="/club">Guardar en mi cuenta</Link>
            <Link to="/calendario">Abrir calendario</Link>
          </div>
        </article>

        <article className="art-card art-card--side">
          <header>
            <p>Siguientes fechas</p>
            <h2>Agenda inmediata</h2>
          </header>
          <ul>
            {fixtures.map((fixture) => (
              <li key={fixture.id}>
                <div>
                  <strong>
                    {fixture.homeTeam} vs {fixture.awayTeam}
                  </strong>
                  <span>{fixture.competition}</span>
                </div>
                <p>{formatMatchDate(fixture.date)}</p>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="section-shell art-stories">
        <header>
          <p>Historias del dia</p>
          <h2>Actualidad y seguimiento del club</h2>
        </header>

        <div className="art-stories__grid">
          {stories.map((story, index) => (
            <article key={story.title} className={`art-story ${index === 0 ? 'art-story--feature' : ''}`}>
              <img src={story.image} alt={story.title} decoding="async" />
              <div>
                <p>{story.category}</p>
                <h3>{story.title}</h3>
                <Link to={story.href}>Explorar</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
