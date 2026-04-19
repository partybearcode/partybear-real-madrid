import { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'rm_store_cart_v1'

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return typeof parsed === 'object' && parsed !== null ? parsed : {}
  } catch {
    return {}
  }
}

export function useCart() {
  const [cartMap, setCartMap] = useState(() => loadCart())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartMap))
  }, [cartMap])

  const itemCount = useMemo(
    () => Object.values(cartMap).reduce((acc, quantity) => acc + Number(quantity || 0), 0),
    [cartMap],
  )

  function addItem(productId) {
    setCartMap((prev) => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }))
  }

  function removeItem(productId) {
    setCartMap((prev) => {
      if (!prev[productId]) return prev
      if (prev[productId] === 1) {
        const next = { ...prev }
        delete next[productId]
        return next
      }
      return { ...prev, [productId]: prev[productId] - 1 }
    })
  }

  function clearCart() {
    setCartMap({})
  }

  return {
    cartMap,
    itemCount,
    addItem,
    removeItem,
    clearCart,
  }
}
