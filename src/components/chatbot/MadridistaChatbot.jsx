import { useMemo, useState } from 'react'

const starterMessage = {
  id: 'assistant-welcome',
  role: 'assistant',
  text: 'Soy tu asistente madridista. Preguntame sobre partidos, historia, tactica o jugadores del Real Madrid.',
}

const configuredChatbotBaseUrl = String(import.meta.env.VITE_CHATBOT_API_BASE_URL || '').trim()
const browserHostname = typeof window === 'undefined' ? '' : window.location.hostname
const localBasePattern = /^https?:\/\/(?:localhost|127(?:\.\d{1,3}){3})(?::\d+)?$/i
const shouldUseConfiguredBaseUrl =
  configuredChatbotBaseUrl &&
  (!localBasePattern.test(configuredChatbotBaseUrl) || /^(localhost|127(?:\.\d{1,3}){3})$/i.test(browserHostname))
const chatbotEndpoint = shouldUseConfiguredBaseUrl
  ? `${configuredChatbotBaseUrl.replace(/\/+$/, '')}/api/chatbot`
  : '/api/chatbot'

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

async function parseApiPayload(response) {
  const text = await response.text()
  if (!text) return {}

  try {
    return JSON.parse(text)
  } catch {
    return {
      error: 'El servidor devolvio una respuesta invalida.',
    }
  }
}

export function MadridistaChatbot() {
  const [messages, setMessages] = useState([starterMessage])
  const [draft, setDraft] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const history = useMemo(
    () =>
      messages
        .filter((item) => item.id !== starterMessage.id)
        .map((item) => ({
          role: item.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: item.text }],
        })),
    [messages],
  )

  async function sendMessage(customMessage) {
    if (isLoading) return

    const clean = String(customMessage || '').trim()
    if (!clean) return

    setError('')
    setIsLoading(true)

    const userMessage = { id: createId(), role: 'user', text: clean }
    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    setDraft('')

    try {
      const response = await fetch(chatbotEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: clean,
          history,
        }),
      })

      const payload = await parseApiPayload(response)

      if (!response.ok) {
        throw new Error(payload?.error || 'No se pudo contactar con el asistente.')
      }

      if (!payload?.reply) {
        throw new Error('El asistente no devolvio una respuesta valida.')
      }

      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: 'assistant',
          text: payload.reply,
        },
      ])
    } catch (requestError) {
      if (requestError?.name === 'TypeError') {
        setError(
          'No se pudo conectar con el asistente. En local arranca el backend en el puerto 3001 y en Firebase despliega Hosting + Functions.',
        )
      } else {
        setError(requestError?.message || 'Error al enviar el mensaje.')
      }
      setMessages(nextMessages)
    } finally {
      setIsLoading(false)
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    sendMessage(draft)
  }

  return (
    <section className="chatbot-shell" aria-label="Chatbot madridista">
      <header className="chatbot-header">
        <p>Asistente Madridista IA</p>
        <small>Analisis y conversacion en linea blanca</small>
      </header>

      <div className="chatbot-thread" role="log" aria-live="polite">
        {messages.map((message) => (
          <article
            key={message.id}
            className={`chatbot-bubble ${message.role === 'user' ? 'chatbot-bubble--user' : 'chatbot-bubble--assistant'}`}
          >
            {message.text}
          </article>
        ))}

        {isLoading && <p className="chatbot-typing">Asistente escribiendo...</p>}
      </div>

      {error && <p className="chatbot-error">{error}</p>}

      <form className="chatbot-form" onSubmit={handleSubmit}>
        <textarea
          className="chatbot-input"
          placeholder="Pregunta sobre el Real Madrid..."
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          rows={2}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault()
              sendMessage(draft)
            }
          }}
        />
        <button type="submit" className="button button--primary" disabled={isLoading || !draft.trim()}>
          Enviar
        </button>
      </form>
    </section>
  )
}
