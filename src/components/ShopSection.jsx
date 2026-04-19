import { useMemo, useState } from 'react'

function formatPrice(value) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(value)
}

export function ShopSection({
  categories,
  products,
  cartMap,
  onAddItem,
  onRemoveItem,
  onClearCart,
}) {
  const [activeCategory, setActiveCategory] = useState('all')

  const visibleProducts = useMemo(
    () => products.filter((product) => activeCategory === 'all' || product.category === activeCategory),
    [activeCategory, products],
  )

  const summary = useMemo(() => {
    return products.reduce(
      (acc, product) => {
        const quantity = cartMap[product.id] || 0
        if (quantity > 0) {
          acc.count += quantity
          acc.total += quantity * product.price
        }
        return acc
      },
      { count: 0, total: 0 },
    )
  }, [cartMap, products])

  return (
    <section id="tienda" className="section-shell content-section">
      <header className="section-heading">
        <div className="store-heading">
          <h2>Productos destacados</h2>
          <p>Equipaciones, prendas de entrenamiento y accesorios oficiales del club organizados por tipo de producto.</p>
        </div>
      </header>

      <div className="shop-layout">
        <div>
          <div className="shop-category-list" aria-label="Categorias de la tienda">
            {categories.map((category) => {
              const count =
                category.id === 'all'
                  ? products.length
                  : products.filter((product) => product.category === category.id).length

              return (
                <button
                  key={category.id}
                  type="button"
                  className={`shop-category ${activeCategory === category.id ? 'shop-category--active' : ''}`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <span>{category.label}</span>
                  <strong>{count}</strong>
                </button>
              )
            })}
          </div>

          <div className="shop-grid">
            {visibleProducts.map((product) => {
              const quantity = cartMap[product.id] || 0

              return (
                <article key={product.id} className="product-card">
                  <div className="product-card__media">
                    <img src={product.image} alt={product.name} loading="lazy" decoding="async" />
                    <div className="product-card__badges">
                      <span>{product.badge}</span>
                      <span>{product.collection}</span>
                    </div>
                  </div>

                  <div className="product-card__content">
                    <div className="product-card__topline">
                      <p>{product.sourceLabel}</p>
                      <strong>{formatPrice(product.price)}</strong>
                    </div>

                    <h3>{product.name}</h3>
                    <p>{product.description}</p>

                    <div className="product-card__actions">
                      <button type="button" className="button button--primary" onClick={() => onAddItem(product.id)}>
                        Anadir
                      </button>
                      <button
                        type="button"
                        className="button button--secondary"
                        onClick={() => onRemoveItem(product.id)}
                        disabled={quantity === 0}
                      >
                        Quitar
                      </button>
                      <a className="button button--ghost" href={product.sourceUrl} target="_blank" rel="noreferrer">
                        Ver tienda oficial
                      </a>
                    </div>

                    <div className="product-card__footer">
                      <span className="product-card__qty">En carrito: {quantity}</span>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>

        <aside className="shop-summary">
          <p className="shop-summary__eyebrow">Carrito</p>
          <h3>Resumen de compra</h3>
          <p>Productos: {summary.count}</p>
          <p>Total: {formatPrice(summary.total)}</p>
          <button
            type="button"
            className="button button--primary"
            disabled={summary.count === 0}
            onClick={onClearCart}
          >
            Vaciar carrito
          </button>
          <p className="shop-summary__hint">
            Los enlaces abren la ficha oficial del producto. El carrito de esta web se guarda solo en tu navegador.
          </p>
        </aside>
      </div>
    </section>
  )
}
