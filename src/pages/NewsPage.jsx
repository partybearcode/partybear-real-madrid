import { PageHero } from '../components/common/PageHero'
import { NewsHighlights } from '../components/NewsHighlights'
import { RssFeed } from '../components/RssFeed'
import { highlights } from '../data/siteContent'

export function NewsPage() {
  return (
    <>
      <PageHero
        eyebrow="Actualidad"
        title="Noticias del Real Madrid"
        description="Cobertura diaria, piezas destacadas y seguimiento en tiempo real por RSS."
      />
      <NewsHighlights items={highlights} />
      <RssFeed />
    </>
  )
}

