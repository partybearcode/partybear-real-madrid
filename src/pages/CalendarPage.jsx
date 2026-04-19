import { useRef } from 'react'
import { MatchCalendar } from '../components/MatchCalendar'
import { PageHero } from '../components/common/PageHero'
import { useAppContext } from '../hooks/useAppContext'
import { useCalendarTree } from '../hooks/useCalendarTree'

export function CalendarPage() {
  const fileInputRef = useRef(null)
  const exampleFiles = [
    { label: 'JSON', href: '/import-examples/datos.json' },
    { label: 'CSV', href: '/import-examples/datos.csv' },
    { label: 'XML', href: '/import-examples/datos.xml' },
    { label: 'XLSX', href: '/import-examples/datos.xlsx' },
    { label: 'XLS', href: '/import-examples/datos.xls' },
    { label: 'ODS', href: '/import-examples/datos.ods' },
    { label: 'XLSB', href: '/import-examples/datos.xlsb' },
    { label: 'FODS', href: '/import-examples/datos.fods' },
    { label: 'SLK', href: '/import-examples/datos.slk' },
    { label: 'DIF', href: '/import-examples/datos.dif' },
    { label: 'HTML', href: '/import-examples/datos.html' },
  ]

  const {
    auth: { isAuthenticated, savedMatchIds, savingMatchId, toggleSavedMatch },
  } = useAppContext()

  const {
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
  } = useCalendarTree()

  const hasEvents = events.length > 0
  const exportButtons = [
    { label: 'JSON', onClick: exportAsJson },
    { label: 'CSV', onClick: exportAsCsv },
    { label: 'XML', onClick: exportAsXml },
    { label: 'XLSX', onClick: exportAsXlsx },
    { label: 'XLS', onClick: exportAsXls },
    { label: 'ODS', onClick: exportAsOds },
    { label: 'XLSB', onClick: exportAsXlsb },
    { label: 'FODS', onClick: exportAsFods },
    { label: 'SLK', onClick: exportAsSlk },
    { label: 'DIF', onClick: exportAsDif },
    { label: 'HTML', onClick: exportAsHtml },
  ]

  async function handleFileChange(event) {
    const file = event.target.files?.[0]
    await importFromFile(file)
    event.target.value = ''
  }

  return (
    <>
      <PageHero
        eyebrow="Calendario"
        title="Agenda conectada con Firebase"
        description="Arbol independiente en Firebase. Importa y exporta JSON, CSV, XML, XLSX, XLS, ODS, XLSB, FODS, SLK, DIF y HTML."
      />

      <section className="section-shell content-section">
        <div className="calendar-data-toolbar">
          <button type="button" className="button button--primary" onClick={seedDefaultCalendar} disabled={isProcessing}>
            Importar JSON por defecto a Firebase
          </button>

          <button
            type="button"
            className="button button--secondary"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
          >
            Importar archivo
          </button>
          <button
            type="button"
            className="button button--secondary"
            onClick={retryFirebaseConnection}
            disabled={isLoading}
          >
            Reintentar Firebase
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="calendar-file-input"
            accept=".json,.csv,.xml,.xlsx,.xls,.ods,.xlsb,.fods,.slk,.dif,.html,.htm"
            onChange={handleFileChange}
          />
        </div>

        <div className="calendar-export-toolbar">
          {exportButtons.map((button) => (
            <button key={button.label} type="button" onClick={button.onClick} disabled={!hasEvents}>
              {button.label}
            </button>
          ))}
        </div>

        <div className="calendar-export-toolbar">
          {exampleFiles.map((file) => (
            <a key={file.href} className="button button--secondary" href={file.href} download>
              Ejemplo {file.label}
            </a>
          ))}
        </div>

        {(message || error) && (
          <p className={`calendar-feedback ${error ? 'calendar-feedback--error' : ''}`}>{message || error}</p>
        )}
        {isFallbackMode && !error && (
          <p className="calendar-feedback">
            Estas viendo modo local temporal. Reintenta Firebase cuando publiques reglas.
          </p>
        )}
      </section>

      {isLoading ? (
        <section className="section-shell content-section">
          <p className="calendar-loading">Cargando calendario desde Firebase...</p>
        </section>
      ) : (
        <MatchCalendar
          fixtures={events}
          isAuthenticated={isAuthenticated}
          savedMatchIds={savedMatchIds}
          savingMatchId={savingMatchId}
          onToggleSave={toggleSavedMatch}
        />
      )}
    </>
  )
}

