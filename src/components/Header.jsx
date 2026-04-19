import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

export function Header({
  topLinks,
  mainLinks,
  cartItems,
  isAuthenticated,
  authLoading,
  userDisplayName,
  onSignOut,
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [headerHidden, setHeaderHidden] = useState(false)
  const lastScrollRef = useRef(0)
  const hiddenRef = useRef(false)
  const mobileMenuRef = useRef(null)
  const mobileMetaLinks = topLinks.slice(0, 3)

  function getNavLinkClass({ isActive }) {
    return `header-link header-link--main${isActive ? ' header-link--active' : ''}`
  }

  function closeMenu() {
    setMenuOpen(false)
  }

  function toggleMenu() {
    setMenuOpen((value) => {
      const next = !value
      if (next && hiddenRef.current) {
        hiddenRef.current = false
        setHeaderHidden(false)
      }
      return next
    })
  }

  useEffect(() => {
    if (!menuOpen) return undefined

    function handlePointerDown(event) {
      const target = event.target
      if (!(target instanceof Node)) return

      const insideMenu = mobileMenuRef.current?.contains(target)
      const insideButton = target instanceof Element && target.closest('.icon-button--menu')
      if (!insideMenu && !insideButton) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [menuOpen])

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 1024) {
        setMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    hiddenRef.current = headerHidden
  }, [headerHidden])

  useEffect(() => {
    lastScrollRef.current = window.scrollY

    function handleScroll() {
      if (window.innerWidth <= 1024) {
        if (hiddenRef.current) {
          hiddenRef.current = false
          setHeaderHidden(false)
        }
        lastScrollRef.current = window.scrollY
        return
      }

      const currentY = window.scrollY
      const delta = currentY - lastScrollRef.current
      let nextHidden = hiddenRef.current

      if (menuOpen || currentY <= 24) {
        nextHidden = false
      } else if (delta > 9 && currentY > 92) {
        nextHidden = true
      } else if (delta < -7) {
        nextHidden = false
      }

      if (nextHidden !== hiddenRef.current) {
        hiddenRef.current = nextHidden
        setHeaderHidden(nextHidden)
      }

      lastScrollRef.current = currentY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return undefined

    function handleEscape(event) {
      if (event.key === 'Escape') {
        setMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return

    mobileMenuRef.current?.focus()
  }, [menuOpen])

  return (
    <header className={`site-header ${headerHidden ? 'is-hidden' : ''} ${menuOpen ? 'is-menu-open' : ''}`}>
      <div className="header-main">
        <div className="section-shell header-main__inner">
          <button
            className={`icon-button icon-button--menu ${menuOpen ? 'is-open' : ''}`}
            type="button"
            aria-label={menuOpen ? 'Cerrar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={toggleMenu}
          >
            <span className="icon-bars" aria-hidden="true" />
            <span className="icon-button__label">Menu</span>
          </button>

          <Link className="brand" to="/" aria-label="Portada Real Madrid">
            <span className="brand-logos">
              <img src="/media/teams/real-madrid-navy-source.svg" className="brand-logo brand-logo--main" alt="Escudo Real Madrid" />
              <span className="brand-divider" aria-hidden="true" />
              <img src="/parche-15-ucl.svg" className="brand-logo brand-logo--champions" alt="Parche 15 Champions" />
            </span>
            <span className="brand__text">Real Madrid CF</span>
          </Link>

          <nav className="main-nav" aria-label="Navegacion principal">
            {mainLinks.map((link) => (
              <NavLink key={link.label} className={getNavLinkClass} to={link.href} end={link.href === '/'}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="header-account">
            <Link className="signin-button" to="/club">
              {authLoading ? 'Cargando...' : isAuthenticated ? userDisplayName : 'Acceder'}
            </Link>
            {isAuthenticated && (
              <button className="signout-button" type="button" onClick={onSignOut}>
                Salir
              </button>
            )}
          </div>
        </div>
      </div>

      {menuOpen && (
        <aside
          id="mobile-menu"
          className="mobile-menu"
          aria-label="Menu movil"
          aria-hidden={!menuOpen}
          tabIndex={-1}
          ref={mobileMenuRef}
        >
          <div className="mobile-menu__head">
            <div className="mobile-menu__title">
              <strong>Menu</strong>
              <span>Accesos principales del club</span>
            </div>
            <button type="button" className="mobile-menu__close" onClick={closeMenu}>
              Cerrar
            </button>
          </div>

          <nav className="mobile-menu__nav">
            {mainLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.href}
                className={({ isActive }) => `mobile-menu__link${isActive ? ' is-active' : ''}`}
                onClick={closeMenu}
                end={link.href === '/'}
              >
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mobile-menu__utility">
            <Link to="/tienda" onClick={closeMenu}>
              Tienda ({cartItems})
            </Link>
            <Link to="/club" onClick={closeMenu}>
              {authLoading ? 'Cargando...' : isAuthenticated ? userDisplayName : 'Acceder'}
            </Link>
            {isAuthenticated && (
              <button
                type="button"
                onClick={() => {
                  closeMenu()
                  onSignOut()
                }}
              >
                Cerrar sesion
              </button>
            )}
          </div>

          <div className="mobile-menu__meta">
            {mobileMetaLinks.map((link) => (
              <Link key={link.label} to={link.href} onClick={closeMenu}>
                {link.label}
              </Link>
            ))}
          </div>
        </aside>
      )}
    </header>
  )
}
