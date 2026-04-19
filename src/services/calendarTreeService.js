import Papa from 'papaparse'
import { Builder } from 'xml2js/lib/builder'
import * as XLSX from '@e965/xlsx'
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore'
import { db } from '../lib/firebase'

const CALENDAR_DOC_PATH = ['calendarTree', 'default']
const EVENTS_COLLECTION_PATH = ['calendarTree', 'default', 'events']
const META_DOC = doc(db, ...CALENDAR_DOC_PATH)
const EXPORT_BASE_NAME = 'datos'
const IMPORTABLE_SPREADSHEET_FORMATS = new Set(['xlsx', 'xls', 'ods', 'xlsb', 'fods', 'slk', 'dif', 'html', 'htm'])

function getSpreadsheetMimeType(format) {
  switch (format) {
    case 'xls':
      return 'application/vnd.ms-excel'
    case 'xlsb':
      return 'application/vnd.ms-excel.sheet.binary.macroEnabled.12'
    case 'ods':
      return 'application/vnd.oasis.opendocument.spreadsheet'
    case 'fods':
      return 'application/vnd.oasis.opendocument.spreadsheet-flat-xml'
    case 'html':
      return 'text/html;charset=utf-8'
    case 'slk':
      return 'application/vnd.ms-excel'
    case 'dif':
      return 'text/plain;charset=utf-8'
    default:
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  }
}

function slugify(value) {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function normalizeTeamType(value) {
  const lower = String(value || '').toLowerCase()
  if (['basket', 'basketball', 'baloncesto', 'acb', 'euroleague'].includes(lower)) return 'baloncesto'
  return 'futbol'
}

function normalizeDate(dateValue) {
  if (!dateValue) return new Date().toISOString()
  const parsed = new Date(dateValue)
  if (Number.isNaN(parsed.getTime())) return new Date().toISOString()
  return parsed.toISOString()
}

function normalizeStatus(value) {
  if (!value) return 'Programado'
  return String(value)
}

function normalizeCalendarEvent(raw, index = 0) {
  const homeTeam = String(raw.homeTeam || raw.home || raw.local || '').trim()
  const awayTeam = String(raw.awayTeam || raw.away || raw.visitor || '').trim()
  const competition = String(raw.competition || raw.tournament || raw.league || 'Partido').trim()
  const venue = String(raw.venue || raw.stadium || raw.field || 'Por confirmar').trim()
  const date = normalizeDate(raw.date || raw.dateTime || raw.datetime || raw.kickoff || raw.startDate)
  const status = normalizeStatus(raw.status || raw.state)
  const teamType = normalizeTeamType(raw.teamType || raw.sport || raw.section)
  const fallbackId = `${competition}-${homeTeam}-${awayTeam}-${date}-${index}`

  return {
    id: String(raw.id || slugify(fallbackId)),
    teamType,
    competition,
    date,
    venue,
    homeTeam,
    awayTeam,
    status,
  }
}

function normalizeEventsArray(items) {
  if (!Array.isArray(items)) return []
  return items
    .map((item, index) => normalizeCalendarEvent(item, index))
    .filter((event) => event.homeTeam && event.awayTeam)
}

export function explainFirestoreError(error, action = 'leer') {
  const code = String(error?.code || '').toLowerCase()
  const status = String(error?.status || '').toUpperCase()

  if (code.includes('permission-denied') || status === 'PERMISSION_DENIED') {
    return `Firebase no permite ${action} el calendario (PERMISSION_DENIED). Revisa y publica reglas de Firestore para calendarTree.`
  }

  if (code.includes('unauthenticated') || status === 'UNAUTHENTICATED') {
    return `Firebase requiere autenticacion para ${action} el calendario.`
  }

  if (code.includes('unavailable') || status === 'UNAVAILABLE') {
    return 'Firebase no esta disponible temporalmente. Revisa conexion e intenta de nuevo.'
  }

  if (code.includes('not-found') || status === 'NOT_FOUND') {
    return 'No se encontro la base de datos de Firestore para este proyecto.'
  }

  return `No se pudo ${action} el calendario en Firebase.`
}

function readXmlText(element, selectors) {
  for (const selector of selectors) {
    const value = element.querySelector(selector)?.textContent?.trim()
    if (value) return value
  }

  return ''
}

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('No se pudo leer el archivo.'))
    reader.readAsText(file)
  })
}

function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('No se pudo leer el archivo binario.'))
    reader.readAsArrayBuffer(file)
  })
}

function triggerTextDownload(filename, mimeType, content) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function triggerBinaryDownload(filename, mimeType, content) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

async function parseJsonFile(file) {
  const text = await readFileAsText(file)
  const parsed = JSON.parse(text)

  if (Array.isArray(parsed)) return normalizeEventsArray(parsed)
  if (Array.isArray(parsed?.events)) return normalizeEventsArray(parsed.events)
  return []
}

async function parseCsvFile(file) {
  const text = await readFileAsText(file)
  const parsed = Papa.parse(text, { header: true, skipEmptyLines: true })
  return normalizeEventsArray(parsed.data)
}

async function parseXmlFile(file) {
  const text = await readFileAsText(file)
  const parser = new DOMParser()
  const xml = parser.parseFromString(text, 'application/xml')
  const parserError = xml.querySelector('parsererror')

  if (parserError) {
    throw new Error('El XML no es valido.')
  }

  const nodes = Array.from(xml.querySelectorAll('event, match'))
  const events = nodes.map((node, index) => ({
    id: node.getAttribute('id') || `xml-event-${index + 1}`,
    homeTeam: readXmlText(node, ['homeTeam', 'home', 'local']),
    awayTeam: readXmlText(node, ['awayTeam', 'away', 'visitor']),
    competition: readXmlText(node, ['competition', 'tournament', 'league']),
    venue: readXmlText(node, ['venue', 'stadium', 'field']),
    teamType: readXmlText(node, ['teamType', 'sport', 'section']),
    status: readXmlText(node, ['status', 'state']),
    date: readXmlText(node, ['date', 'dateTime', 'datetime', 'kickoff', 'startDate']),
  }))

  return normalizeEventsArray(events)
}

async function parseSpreadsheetFile(file) {
  const buffer = await readFileAsArrayBuffer(file)
  const workbook = XLSX.read(buffer, { type: 'array' })
  const sheetName = workbook.SheetNames[0]
  if (!sheetName) return []
  const sheet = workbook.Sheets[sheetName]
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' })
  return normalizeEventsArray(rows)
}

export function subscribeCalendarTree({ onData, onError }) {
  const eventsQuery = query(collection(db, ...EVENTS_COLLECTION_PATH), orderBy('date', 'asc'))
  return onSnapshot(
    eventsQuery,
    (snapshot) => {
      const events = snapshot.docs.map((item) => normalizeCalendarEvent({ id: item.id, ...item.data() }))
      onData(events)
    },
    (error) => {
      onError?.(error)
    },
  )
}

export async function upsertCalendarEvents(events, source = 'manual') {
  const normalized = normalizeEventsArray(events)
  if (!normalized.length) return { count: 0 }

  const batch = writeBatch(db)

  normalized.forEach((event) => {
    const ref = doc(db, ...EVENTS_COLLECTION_PATH, event.id)
    batch.set(ref, event, { merge: true })
  })

  batch.set(
    META_DOC,
    {
      source,
      totalEvents: normalized.length,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )

  await batch.commit()
  return { count: normalized.length }
}

export async function importCalendarFile(file) {
  const extension = file.name.split('.').pop()?.toLowerCase() || ''
  let events = []

  if (extension === 'json') events = await parseJsonFile(file)
  else if (extension === 'csv') events = await parseCsvFile(file)
  else if (extension === 'xml') events = await parseXmlFile(file)
  else if (IMPORTABLE_SPREADSHEET_FORMATS.has(extension)) events = await parseSpreadsheetFile(file)
  else throw new Error('Formato no soportado. Usa JSON, CSV, XML, XLSX, XLS, ODS, XLSB, FODS, SLK, DIF o HTML.')

  if (!events.length) {
    throw new Error('El archivo no contiene eventos validos para importar.')
  }

  return events
}

export function exportCalendarToJson(events) {
  const content = JSON.stringify(events, null, 2)
  triggerTextDownload(`${EXPORT_BASE_NAME}.json`, 'application/json;charset=utf-8', content)
}

export function exportCalendarToCsv(events) {
  const content = Papa.unparse(events)
  triggerTextDownload(`${EXPORT_BASE_NAME}.csv`, 'text/csv;charset=utf-8', content)
}

export function exportCalendarToXml(events) {
  const builder = new Builder({ headless: false, rootName: 'calendar', renderOpts: { pretty: true } })
  const xml = builder.buildObject({ events: { event: events } })
  triggerTextDownload(`${EXPORT_BASE_NAME}.xml`, 'application/xml;charset=utf-8', xml)
}

export function exportCalendarToSpreadsheet(events, format = 'xlsx') {
  const normalizedFormat = format === 'htm' ? 'html' : format
  const worksheet = XLSX.utils.json_to_sheet(events)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Calendar')
  const output = XLSX.write(workbook, { type: 'array', bookType: normalizedFormat })
  const mime = getSpreadsheetMimeType(normalizedFormat)

  triggerBinaryDownload(`${EXPORT_BASE_NAME}.${normalizedFormat}`, mime, output)
}
