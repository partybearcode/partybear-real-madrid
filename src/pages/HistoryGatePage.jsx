import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHero } from '../components/common/PageHero'
import { HistoryPage } from './HistoryPage'

const MIN_AVAILABLE_RATIO = 1.9
const MAX_AVAILABLE_RATIO = 2.1

function getViewportStatus() {
  if (typeof window === 'undefined') {
    return { isSupported: true, ratio: MIN_AVAILABLE_RATIO }
  }

  const ratio = window.innerWidth / Math.max(window.innerHeight, 1)
  const isDesktopWidth = window.innerWidth >= 1024
  const isSupported = isDesktopWidth && ratio >= MIN_AVAILABLE_RATIO && ratio <= MAX_AVAILABLE_RATIO

  return { isSupported, ratio }
}

export function HistoryGatePage() {
  const [viewport, setViewport] = useState(getViewportStatus)

  useEffect(() => {
    function handleResize() {
      setViewport(getViewportStatus())
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [])

  const ratioLabel = useMemo(() => viewport.ratio.toFixed(2), [viewport.ratio])

  if (viewport.isSupported) {
    return <HistoryPage />
  }

  return (
    <>
      <PageHero
        eyebrow="Historia"
        title="No disponible en este dispositivo"
        description="La experiencia de Historia se ha bloqueado fuera de pantallas de escritorio con relacion entre 1.90 y 2.10 para no degradar los efectos."
      />

      <section className="section-shell content-section">
        <article className="device-gate">
          <div className="device-gate__copy">
            <p className="device-gate__eyebrow">Modo restringido</p>
            <h2>Necesitas una pantalla panoramica compatible</h2>
            <p>
              Esta ruta solo se habilita cuando el viewport tiene ancho de escritorio y una relacion entre 1.90 y 2.10.
              Tu relacion actual es <strong>{ratioLabel}</strong>.
            </p>
          </div>

          <div className="device-gate__actions">
            <Link className="button button--primary" to="/">
              Volver a portada
            </Link>
            <Link className="button button--secondary" to="/actualidad">
              Ir a actualidad
            </Link>
          </div>
        </article>
      </section>
    </>
  )
}
