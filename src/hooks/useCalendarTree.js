import { useCallback, useEffect, useState } from 'react'
import defaultCalendar from '../data/defaultCalendar.json'
import {
  explainFirestoreError,
  exportCalendarToCsv,
  exportCalendarToJson,
  exportCalendarToSpreadsheet,
  exportCalendarToXml,
  importCalendarFile,
  subscribeCalendarTree,
  upsertCalendarEvents,
} from '../services/calendarTreeService'

export function useCalendarTree() {
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isFallbackMode, setIsFallbackMode] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const unsubscribe = subscribeCalendarTree({
      onData: (items) => {
        setEvents(items)
        setIsFallbackMode(false)
        setIsLoading(false)
      },
      onError: (firebaseError) => {
        setError(`${explainFirestoreError(firebaseError, 'leer')} Se cargo modo local temporal.`)
        setEvents(defaultCalendar)
        setIsFallbackMode(true)
        setIsLoading(false)
      },
    })

    return () => unsubscribe()
  }, [reloadKey])

  const clearFeedback = useCallback(() => {
    setError('')
    setMessage('')
  }, [])

  const retryFirebaseConnection = useCallback(() => {
    setIsLoading(true)
    clearFeedback()
    setReloadKey((value) => value + 1)
  }, [clearFeedback])

  const seedDefaultCalendar = useCallback(async () => {
    setIsProcessing(true)
    clearFeedback()
    try {
      const result = await upsertCalendarEvents(defaultCalendar, 'default-json-seed')
      setMessage(`Calendario por defecto importado (${result.count} eventos).`)
    } catch (firebaseError) {
      setError(explainFirestoreError(firebaseError, 'escribir'))
    } finally {
      setIsProcessing(false)
    }
  }, [clearFeedback])

  const importFromFile = useCallback(
    async (file) => {
      if (!file) return
      setIsProcessing(true)
      clearFeedback()
      try {
        const eventsFromFile = await importCalendarFile(file)
        const result = await upsertCalendarEvents(eventsFromFile, `file:${file.name}`)
        setMessage(`Archivo importado (${result.count} eventos).`)
      } catch (importError) {
        const code = String(importError?.code || '')
        if (code) {
          setError(explainFirestoreError(importError, 'escribir'))
        } else {
          setError(importError?.message || 'No se pudo importar el archivo.')
        }
      } finally {
        setIsProcessing(false)
      }
    },
    [clearFeedback],
  )

  const exportAsJson = useCallback(() => {
    clearFeedback()
    exportCalendarToJson(events)
    setMessage('Calendario exportado a JSON.')
  }, [clearFeedback, events])

  const exportAsCsv = useCallback(() => {
    clearFeedback()
    exportCalendarToCsv(events)
    setMessage('Calendario exportado a CSV.')
  }, [clearFeedback, events])

  const exportAsXml = useCallback(() => {
    clearFeedback()
    exportCalendarToXml(events)
    setMessage('Calendario exportado a XML.')
  }, [clearFeedback, events])

  const exportAsXlsx = useCallback(() => {
    clearFeedback()
    exportCalendarToSpreadsheet(events, 'xlsx')
    setMessage('Calendario exportado a XLSX.')
  }, [clearFeedback, events])

  const exportAsXls = useCallback(() => {
    clearFeedback()
    exportCalendarToSpreadsheet(events, 'xls')
    setMessage('Calendario exportado a XLS.')
  }, [clearFeedback, events])

  const exportAsOds = useCallback(() => {
    clearFeedback()
    exportCalendarToSpreadsheet(events, 'ods')
    setMessage('Calendario exportado a ODS.')
  }, [clearFeedback, events])

  const exportAsXlsb = useCallback(() => {
    clearFeedback()
    exportCalendarToSpreadsheet(events, 'xlsb')
    setMessage('Calendario exportado a XLSB.')
  }, [clearFeedback, events])

  const exportAsFods = useCallback(() => {
    clearFeedback()
    exportCalendarToSpreadsheet(events, 'fods')
    setMessage('Calendario exportado a FODS.')
  }, [clearFeedback, events])

  const exportAsSlk = useCallback(() => {
    clearFeedback()
    exportCalendarToSpreadsheet(events, 'slk')
    setMessage('Calendario exportado a SLK.')
  }, [clearFeedback, events])

  const exportAsDif = useCallback(() => {
    clearFeedback()
    exportCalendarToSpreadsheet(events, 'dif')
    setMessage('Calendario exportado a DIF.')
  }, [clearFeedback, events])

  const exportAsHtml = useCallback(() => {
    clearFeedback()
    exportCalendarToSpreadsheet(events, 'html')
    setMessage('Calendario exportado a HTML.')
  }, [clearFeedback, events])

  return {
    events,
    isLoading,
    isProcessing,
    error,
    message,
    isFallbackMode,
    seedDefaultCalendar,
    importFromFile,
    retryFirebaseConnection,
    exportAsJson,
    exportAsCsv,
    exportAsXml,
    exportAsXlsx,
    exportAsXls,
    exportAsOds,
    exportAsXlsb,
    exportAsFods,
    exportAsSlk,
    exportAsDif,
    exportAsHtml,
    clearFeedback,
  }
}
