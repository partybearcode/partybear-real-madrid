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
import { auth, db } from '../lib/firebase'

function fallbackDisplayName(user, displayName = '') {
  const cleanName = String(displayName || '').trim()
  if (cleanName) return cleanName
  return user?.displayName || user?.email?.split('@')[0] || 'Madridista'
}

export function createGoogleProvider() {
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({ prompt: 'select_account' })
  return provider
}

export function subscribeAuth(onChange) {
  return onAuthStateChanged(auth, onChange)
}

export function subscribeUserProfile(uid, { onData, onError }) {
  return onSnapshot(
    doc(db, 'users', uid),
    (snapshot) => {
      onData(snapshot.exists() ? snapshot.data() : null)
    },
    onError,
  )
}

export function subscribeSavedMatches(uid, { onData, onError }) {
  return onSnapshot(
    collection(db, 'calendarUserTree', uid, 'savedEvents'),
    (snapshot) => {
      onData(snapshot.docs.map((item) => item.id))
    },
    onError,
  )
}

export async function syncUserProfile(user) {
  return setDoc(
    doc(db, 'users', user.uid),
    {
      email: user.email,
      displayName: fallbackDisplayName(user),
      photoURL: user.photoURL || '',
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

export async function registerWithEmail({ email, password, displayName }) {
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password)
  const cleanName = String(displayName || '').trim()

  if (cleanName) {
    await updateProfile(credential.user, { displayName: cleanName })
  }

  await setDoc(
    doc(db, 'users', credential.user.uid),
    {
      email: credential.user.email,
      displayName: fallbackDisplayName(credential.user, cleanName),
      favoriteSection: 'futbol',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )

  return credential
}

export function loginWithEmail({ email, password }) {
  return signInWithEmailAndPassword(auth, email.trim(), password)
}

export async function loginWithGoogle({ provider, preferRedirect = false }) {
  if (preferRedirect) {
    await signInWithRedirect(auth, provider)
    return { pendingRedirect: true }
  }

  await signInWithPopup(auth, provider)
  return { pendingRedirect: false }
}

export function logoutUser() {
  return signOut(auth)
}

export async function updateUserProfileDocument({ user, displayName, favoriteSection }) {
  const payload = {
    updatedAt: serverTimestamp(),
  }

  const cleanName = String(displayName || '').trim()
  if (cleanName) payload.displayName = cleanName
  if (favoriteSection) payload.favoriteSection = favoriteSection

  await setDoc(doc(db, 'users', user.uid), payload, { merge: true })

  if (cleanName && auth.currentUser?.displayName !== cleanName) {
    await updateProfile(auth.currentUser, { displayName: cleanName })
  }
}

export async function toggleSavedMatchForUser({ user, match, savedMatchIds }) {
  const matchRef = doc(db, 'calendarUserTree', user.uid, 'savedEvents', match.id)
  const isAlreadySaved = savedMatchIds.includes(match.id)

  if (isAlreadySaved) {
    await deleteDoc(matchRef)
    return { saved: false }
  }

  await setDoc(matchRef, {
    ...match,
    savedAt: serverTimestamp(),
  })

  return { saved: true }
}
