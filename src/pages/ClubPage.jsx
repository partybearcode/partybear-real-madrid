import { useMemo, useState } from 'react'
import { PageHero } from '../components/common/PageHero'
import { useAppContext } from '../hooks/useAppContext'

function AuthCard({ title, className = '', children }) {
  return (
    <article className={`auth-card ${className}`.trim()}>
      <h2>{title}</h2>
      {children}
    </article>
  )
}

export function ClubPage() {
  const {
    auth: {
      user,
      userMeta,
      error,
      isAuthenticated,
      isLoading,
      savedMatchIds,
      login,
      loginWithGoogle,
      logout,
      register,
      updateUserProfile,
      clearError,
    },
  } = useAppContext()

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({
    email: '',
    password: '',
    displayName: '',
  })
  const [authView, setAuthView] = useState('login')
  const [message, setMessage] = useState('')

  const emailLabel = useMemo(() => user?.email || 'Sin email', [user])

  function onInputChange(setter) {
    return (event) => {
      const { name, value } = event.target
      setter((prev) => ({ ...prev, [name]: value }))
    }
  }

  async function handleLoginSubmit(event) {
    event.preventDefault()
    clearError()
    const result = await login(loginForm)
    if (result.ok) {
      setMessage('Sesion iniciada correctamente.')
      setLoginForm({ email: '', password: '' })
    }
  }

  async function handleRegisterSubmit(event) {
    event.preventDefault()
    clearError()
    const result = await register(registerForm)
    if (result.ok) {
      setMessage('Cuenta creada correctamente.')
      setRegisterForm({ email: '', password: '', displayName: '' })
    }
  }

  async function handleGoogleAccess() {
    clearError()
    const result = await loginWithGoogle()

    if (result.ok) {
      setMessage(result.pendingRedirect ? 'Redirigiendo a Google...' : 'Sesion iniciada con Google.')
    }
  }

  async function handleProfileSubmit(event) {
    event.preventDefault()
    clearError()

    const formData = new FormData(event.currentTarget)
    const displayName = formData.get('displayName')?.toString() || ''
    const favoriteSection = formData.get('favoriteSection')?.toString() || 'futbol'

    const result = await updateUserProfile({ displayName, favoriteSection })

    if (result.ok) {
      setMessage('Perfil actualizado.')
    }
  }

  async function handleLogout() {
    await logout()
    setMessage('Sesion cerrada.')
  }

  return (
    <>
      <PageHero
        eyebrow="Club"
        title="Cuenta madridista"
        description="Accede con email o Google para guardar partidos, mantener tu perfil y sincronizar tu actividad en Firebase."
      />

      <section className="section-shell content-section">
        {isLoading ? (
          <div className="auth-status">Comprobando sesion...</div>
        ) : isAuthenticated ? (
          <div className="account-grid">
            <AuthCard title="Mi cuenta">
              <p className="account-line">
                <span>Nombre:</span> {userMeta.displayName}
              </p>
              <p className="account-line">
                <span>Email:</span> {emailLabel}
              </p>
              <p className="account-line">
                <span>Proveedor:</span> {user?.providerData?.[0]?.providerId === 'google.com' ? 'Google' : 'Email y contrasena'}
              </p>
              <p className="account-line">
                <span>Partidos guardados:</span> {savedMatchIds.length}
              </p>
              <button type="button" className="button button--secondary" onClick={handleLogout}>
                Cerrar sesion
              </button>
            </AuthCard>

            <AuthCard title="Editar perfil">
              <form className="auth-form" onSubmit={handleProfileSubmit}>
                <label>
                  Nombre visible
                  <input
                    type="text"
                    name="displayName"
                    defaultValue={userMeta.displayName}
                    required
                  />
                </label>
                <label>
                  Seccion favorita
                  <select name="favoriteSection" defaultValue={userMeta.favoriteSection}>
                    <option value="futbol">Futbol</option>
                    <option value="baloncesto">Baloncesto</option>
                  </select>
                </label>
                <button type="submit" className="button button--primary">
                  Guardar cambios
                </button>
              </form>
            </AuthCard>
          </div>
        ) : (
          <div className="auth-access">
            <article className="auth-access__intro">
              <p className="auth-access__eyebrow">Real Madrid ID</p>
              <h2>Accede a tu zona madridista</h2>
              <p>Guarda partidos en tu calendario personal y configura tu perfil para la app.</p>
              <ul>
                <li>Sincronizacion de partidos guardados</li>
                <li>Perfil personalizado</li>
                <li>Acceso rapido desde movil</li>
              </ul>
            </article>

            <AuthCard title="Acceso" className="auth-card--access">
              <div className="auth-switch" role="tablist" aria-label="Tipo de acceso">
                <button
                  type="button"
                  role="tab"
                  aria-selected={authView === 'login'}
                  className={`auth-switch__button ${authView === 'login' ? 'is-active' : ''}`}
                  onClick={() => setAuthView('login')}
                >
                  Iniciar sesion
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={authView === 'register'}
                  className={`auth-switch__button ${authView === 'register' ? 'is-active' : ''}`}
                  onClick={() => setAuthView('register')}
                >
                  Crear cuenta
                </button>
              </div>

              <button type="button" className="google-access-button" onClick={handleGoogleAccess}>
                <span className="google-access-button__mark" aria-hidden="true">G</span>
                Continuar con Google
              </button>

              <p className="auth-access__separator">o usa tu email para acceder</p>

              {authView === 'login' ? (
              <form className="auth-form" onSubmit={handleLoginSubmit}>
                <label>
                  Email
                  <input
                    type="email"
                    name="email"
                    value={loginForm.email}
                    onChange={onInputChange(setLoginForm)}
                    required
                  />
                </label>
                <label>
                  Contrasena
                  <input
                    type="password"
                    name="password"
                    value={loginForm.password}
                    onChange={onInputChange(setLoginForm)}
                    required
                    minLength={6}
                  />
                </label>
                <button type="submit" className="button button--primary">
                  Entrar
                </button>
              </form>
              ) : (
              <form className="auth-form" onSubmit={handleRegisterSubmit}>
                <label>
                  Nombre
                  <input
                    type="text"
                    name="displayName"
                    value={registerForm.displayName}
                    onChange={onInputChange(setRegisterForm)}
                    required
                  />
                </label>
                <label>
                  Email
                  <input
                    type="email"
                    name="email"
                    value={registerForm.email}
                    onChange={onInputChange(setRegisterForm)}
                    required
                  />
                </label>
                <label>
                  Contrasena
                  <input
                    type="password"
                    name="password"
                    value={registerForm.password}
                    onChange={onInputChange(setRegisterForm)}
                    required
                    minLength={6}
                  />
                </label>
                <button type="submit" className="button button--primary">
                  Registrarme
                </button>
              </form>
              )}
            </AuthCard>
          </div>
        )}

        {(error || message) && (
          <div className={`auth-feedback ${error ? 'auth-feedback--error' : ''}`}>{error || message}</div>
        )}
      </section>
    </>
  )
}
