import { Link } from 'react-router-dom'

function StoryCard({ story }) {
  return (
    <article className="hero-side-card">
      <img className="hero-side-card__image" src={story.image} alt={story.title} loading="lazy" />
      <div className="hero-side-card__content">
        <p className="story-category">{story.category}</p>
        <h3>{story.title}</h3>
        <Link className="story-link" to={story.href}>
          Leer mas
        </Link>
      </div>
    </article>
  )
}

export function HeroSection({ heroStory, sideStories, quickLinks }) {
  return (
    <section id="portada" className="section-shell hero-wrapper">
      <div className="hero-layout">
        <article className="hero-main-card">
          <img className="hero-main-card__image" src={heroStory.image} alt={heroStory.title} />
          <div className="hero-main-card__overlay">
            <p className="story-category story-category--hero">{heroStory.category}</p>
            <h1>{heroStory.title}</h1>
            <p className="hero-main-card__description">{heroStory.description}</p>
            <Link className="button button--primary" to={heroStory.href}>
              Leer noticia
            </Link>
          </div>
        </article>

        <div className="hero-side-grid">
          {sideStories.map((story) => (
            <StoryCard key={story.title} story={story} />
          ))}
        </div>
      </div>

      <div className="quick-links">
        {quickLinks.map((link) => (
          <Link key={link.label} className="quick-links__item" to={link.href}>
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  )
}
