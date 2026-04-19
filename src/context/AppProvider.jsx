import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  updateProfile,
} from 'firebase/auth'
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { auth, db } from '../lib/firebase'
import { useCart } from '../hooks/useCart'
import { AppContext } from './appContext'

function normalizeError(error) {
  const code = error?.code || ''
  if (code.includes('invalid-credential')) return 'Credenciales incorrectas.'
  if (code.includes('email-already-in-use')) return 'Ese email ya tiene una cuenta.'
  if (code.includes('weak-password')) return 'La contrasena debe tener al menos 6 caracteres.'
  if (code.includes('invalid-email')) return 'El email no es valido.'
  if (code.includes('popup-closed-by-user')) return 'Has cerrado la ventana de Google antes de completar el acceso.'
  if (code.includes('popup-blocked')) return 'El navegador ha bloqueado la ventana emergente de Google.'
  if (code.includes('operation-not-allowed')) return 'Debes activar Google como proveedor en Firebase Authentication.'
  if (code.includes('unauthorized-domain')) return 'Este dominio no esta autorizado en Firebase Authentication.'
  if (code.includes('account-exists-with-different-credential')) return 'Ese email ya existe con otro metodo de acceso.'
  return 'No se pudo completar la operacion. Intentalo de nuevo.'
}

function mapProfile(user, profile) {
  const fallbackName = user?.email?.split('@')[0] || 'Madridista'

  return {
    displayName: profile?.displayName || user?.displayName || fallbackName,
    favoriteSection: profile?.favoriteSection || 'futbol',
    photoURL: profile?.photoURL || user?.photoURL || '',
  }
}

export function AppProvider({ children }) {
  const cart = useCart()
  const googleProvider = useMemo(() => {
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' })
    return provider
  }, [])

  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [savedMatchIds, setSavedMatchIds] = useState([])
  const [authLoading, setAuthLoading] = useState(true)
  const [authError, setAuthError] = useState('')
  const [savingMatchId, setSavingMatchId] = useState('')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      setAuthLoading(false)
      setAuthError('')
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) {
      setProfile(null)
      setSavedMatchIds([])
      return
    }

    const profileRef = doc(db, 'users', user.uid)
    const matchesRef = collection(db, 'calendarUserTree', user.uid, 'savedEvents')

    setDoc(
      profileRef,
      {
        email: user.email,
        displayName: user.displayName || user.email?.split('@')[0] || 'Madridista',
        photoURL: user.photoURL || '',
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    ).catch(() => {
      setAuthError('No se pudo sincronizar el perfil con Firestore.')
    })

    const unsubscribeProfile = onSnapshot(
      profileRef,
      (snapshot) => {
        setProfile(snapshot.exists() ? snapshot.data() : null)
      },
      () => {
        setAuthError('No se pudo leer el perfil. Revisa reglas de Firestore.')
      },
    )

    const unsubscribeMatches = onSnapshot(
      matchesRef,
      (snapshot) => {
        setSavedMatchIds(snapshot.docs.map((item) => item.id))
      },
      () => {
        setAuthError('No se pudieron leer los partidos guardados.')
      },
    )

    return () => {
      unsubscribeProfile()
      unsubscribeMatches()
    }
  }, [user])

  const register = useCallback(async ({ email, password, displayName }) => {
    setAuthError('')

    try {
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), password)

      const cleanName = displayName.trim()

      if (cleanName) {
        await updateProfile(credential.user, { displayName: cleanName })
      }

      await setDoc(
        doc(db, 'users', credential.user.uid),
        {
          email: credential.user.email,
          displayName: cleanName || credential.user.email?.split('@')[0] || 'Madridista',
          favoriteSection: 'futbol',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      )

      return { ok: true }
    } catch (error) {
      const message = normalizeError(error)
      setAuthError(message)
      return { ok: false, message }
    }
  }, [])

  const login = useCallback(async ({ email, password }) => {
    setAuthError('')

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password)
      return { ok: true }
    } catch (error) {
      const message = normalizeError(error)
      setAuthError(message)
      return { ok: false, message }
    }
  }, [])

  const loginWithGoogle = useCallback(async () => {
    setAuthError('')

    try {
      const prefersRedirect =
        typeof window !== 'undefined' &&
        (window.matchMedia('(max-width: 768px)').matches || window.matchMedia('(pointer: coarse)').matches)

      if (prefersRedirect) {
        await signInWithRedirect(auth, googleProvider)
        return { ok: true, pendingRedirect: true }
      }

      await signInWithPopup(auth, googleProvider)
      return { ok: true }
    } catch (error) {
      const message = normalizeError(error)
      setAuthError(message)
      return { ok: false, message }
    }
  }, [googleProvider])

  const logout = useCallback(async () => {
    setAuthError('')
    await signOut(auth)
  }, [])

  const updateUserProfile = useCallback(
    async ({ displayName, favoriteSection }) => {
      if (!user) return { ok: false, message: 'Necesitas iniciar sesion.' }

      setAuthError('')

      try {
        const payload = {
          updatedAt: serverTimestamp(),
        }

        const cleanName = displayName.trim()

        if (cleanName) {
          payload.displayName = cleanName
        }

        if (favoriteSection) {
          payload.favoriteSection = favoriteSection
        }

        await setDoc(doc(db, 'users', user.uid), payload, { merge: true })

        if (cleanName && auth.currentUser?.displayName !== cleanName) {
          await updateProfile(auth.currentUser, { displayName: cleanName })
        }

        return { ok: true }
      } catch (error) {
        const message = normalizeError(error)
        setAuthError(message)
        return { ok: false, message }
      }
    },
    [user],
  )

  const toggleSavedMatch = useCallback(
    async (match) => {
      if (!user) return { ok: false, message: 'Inicia sesion para guardar partidos.' }

      setAuthError('')
      setSavingMatchId(match.id)

      try {
        const matchRef = doc(db, 'calendarUserTree', user.uid, 'savedEvents', match.id)
        const isAlreadySaved = savedMatchIds.includes(match.id)

        if (isAlreadySaved) {
          await deleteDoc(matchRef)
        } else {
          await setDoc(matchRef, {
            ...match,
            savedAt: serverTimestamp(),
          })
        }

        return { ok: true }
      } catch (error) {
        const message = normalizeError(error)
        setAuthError(message)
        return { ok: false, message }
      } finally {
        setSavingMatchId('')
      }
    },
    [savedMatchIds, user],
  )

  const clearAuthError = useCallback(() => {
    setAuthError('')
  }, [])

  const authState = useMemo(
    () => ({
      user,
      profile,
      isAuthenticated: Boolean(user),
      isLoading: authLoading,
      error: authError,
      clearError: clearAuthError,
      savedMatchIds,
      savingMatchId,
      register,
      login,
      loginWithGoogle,
      logout,
      updateUserProfile,
      toggleSavedMatch,
      userMeta: mapProfile(user, profile),
    }),
    [
      authError,
      authLoading,
      clearAuthError,
      login,
      loginWithGoogle,
      logout,
      profile,
      register,
      savedMatchIds,
      savingMatchId,
      toggleSavedMatch,
      updateUserProfile,
      user,
    ],
  )

  return <AppContext.Provider value={{ cart, auth: authState }}>{children}</AppContext.Provider>
}
