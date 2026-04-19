import { ShopSection } from '../components/ShopSection'
import { PageHero } from '../components/common/PageHero'
import { shopCategories, shopProducts } from '../data/shop'
import { useAppContext } from '../hooks/useAppContext'

export function StorePage() {
  const {
    cart: { cartMap, addItem, removeItem, clearCart },
  } = useAppContext()

  return (
    <>
      <PageHero
        eyebrow="Tienda"
        title="Tienda del club"
        description="Seleccion de equipaciones, training y accesorios del Real Madrid con referencias actuales del store oficial."
      />
      <ShopSection
        categories={shopCategories}
        products={shopProducts}
        cartMap={cartMap}
        onAddItem={addItem}
        onRemoveItem={removeItem}
        onClearCart={clearCart}
      />
    </>
  )
}
