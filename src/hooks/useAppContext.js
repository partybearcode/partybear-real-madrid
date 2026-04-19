import { useContext } from 'react'
import { AppContext } from '../context/appContext'

export function useAppContext() {
  const value = useContext(AppContext)
  if (!value) {
    throw new Error('useAppContext debe usarse dentro de AppProvider')
  }
  return value
}

