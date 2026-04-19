import { Outlet } from 'react-router-dom'
import { Footer } from '../Footer'
import { Header } from '../Header'
import { footerColumns, sponsors } from '../../data/footer'
import { mainNavLinks, topUtilityLinks } from '../../data/siteContent'
import { useAppContext } from '../../hooks/useAppContext'

export function MainLayout() {
  const {
    cart: { itemCount },
    auth: { isAuthenticated, isLoading, logout, userMeta },
  } = useAppContext()

  return (
    <div className="app-shell">
      <Header
        topLinks={topUtilityLinks}
        mainLinks={mainNavLinks}
        cartItems={itemCount}
        isAuthenticated={isAuthenticated}
        authLoading={isLoading}
        userDisplayName={userMeta.displayName}
        onSignOut={logout}
      />

      <main className="page-content">
        <Outlet />
      </main>

      <Footer sponsors={sponsors} footerColumns={footerColumns} />
    </div>
  )
}
