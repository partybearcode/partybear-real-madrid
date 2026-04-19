export function PageHero({ eyebrow, title, description }) {
  return (
    <section className="section-shell page-hero">
      <p className="page-hero__eyebrow">{eyebrow}</p>
      <h1 className="page-hero__title">{title}</h1>
      <p className="page-hero__description">{description}</p>
    </section>
  )
}

