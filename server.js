/* global process */
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'
import OpenAI from 'openai'

dotenv.config()
dotenv.config({ path: '.env.local', override: true })
dotenv.config({ path: 'functions/.env', override: true })

const app = express()
const port = Number(process.env.CHATBOT_PORT || 3001)
const modelPreference = process.env.GEMINI_MODEL || 'gemini-2.0-flash'
const llmProvider = String(process.env.LLM_PROVIDER || 'local').toLowerCase()
const deepseekBaseUrl = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com'
const deepseekModel = process.env.DEEPSEEK_MODEL || 'deepseek-chat'
const groqBaseUrl = process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1'
const groqModel = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'
const supportedProviders = ['local', 'deepseek', 'gemini', 'groq']

const chatbotContext = `
Eres "Asistente Madridista", la voz digital del madridismo.
Reglas de estilo:
- Responde siempre en espanol neutro y claro.
- Tono: cercano, elegante, apasionado por el Real Madrid.
- Si hay debate, aporta contexto historico y tactico sin faltar al respeto.
- No inventes resultados en directo ni fichajes confirmados si no hay confirmacion del usuario.
- Prioriza analisis de partidos, cantera, historia del club y cultura madridista.
- Frase breve de cierre recomendable: "Hala Madrid".
`.trim()

function cleanText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim()
}

function normalizeForMatch(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
}

function pickRandom(items) {
  if (!Array.isArray(items) || !items.length) return ''
  return items[Math.floor(Math.random() * items.length)]
}

function normalizeHistory(history) {
  if (!Array.isArray(history)) return []

  return history
    .slice(-18)
    .map((item) => ({
      role: item?.role === 'model' ? 'model' : 'user',
      parts: [{ text: cleanText(item?.parts?.[0]?.text || item?.text || '') }],
    }))
    .filter((item) => item.parts[0].text.length > 0)
}

function resolveProvider() {
  return supportedProviders.includes(llmProvider) ? llmProvider : 'local'
}

async function askGemini({ message, history }) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY no configurada en variables de entorno.')
  }

  const client = new GoogleGenerativeAI(apiKey)
  const fallbacks = Array.from(
    new Set([modelPreference, 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-flash-latest']),
  )
  let lastError = null

  for (const modelName of fallbacks) {
    try {
      const model = client.getGenerativeModel({
        model: modelName,
        systemInstruction: chatbotContext,
      })

      const chat = model.startChat({
        history,
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 900,
        },
      })

      const result = await chat.sendMessage(message)
      const text = result?.response?.text?.() || ''
      if (text.trim()) {
        return cleanText(text.replace(/\*/g, ''))
      }
    } catch (error) {
      lastError = error
      const status = Number(error?.status || 0)
      if (status !== 404) {
        break
      }
    }
  }

  throw lastError || new Error('No fue posible generar respuesta con Gemini.')
}

async function askDeepSeek({ message, history }) {
  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY no configurada en variables de entorno.')
  }

  const client = new OpenAI({
    apiKey,
    baseURL: deepseekBaseUrl,
  })

  const messages = [
    { role: 'system', content: chatbotContext },
    ...history.map((item) => ({
      role: item.role === 'model' ? 'assistant' : 'user',
      content: item.parts?.[0]?.text || '',
    })),
    { role: 'user', content: message },
  ]

  const completion = await client.chat.completions.create({
    model: deepseekModel,
    messages,
    temperature: 0.8,
    max_tokens: 900,
  })

  const text = completion?.choices?.[0]?.message?.content
  if (!text || !String(text).trim()) {
    throw new Error('DeepSeek no devolvio contenido.')
  }

  return cleanText(String(text).replace(/\*/g, ''))
}

async function askGroq({ message, history }) {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    throw new Error('GROQ_API_KEY no configurada en variables de entorno.')
  }

  const client = new OpenAI({
    apiKey,
    baseURL: groqBaseUrl,
  })

  const messages = [
    { role: 'system', content: chatbotContext },
    ...history.map((item) => ({
      role: item.role === 'model' ? 'assistant' : 'user',
      content: item.parts?.[0]?.text || '',
    })),
    { role: 'user', content: message },
  ]

  const completion = await client.chat.completions.create({
    model: groqModel,
    messages,
    temperature: 0.8,
    max_tokens: 900,
  })

  const text = completion?.choices?.[0]?.message?.content
  if (!text || !String(text).trim()) {
    throw new Error('Groq no devolvio contenido.')
  }

  return cleanText(String(text).replace(/\*/g, ''))
}

function askLocalMadridista({ message, history }) {
  const text = normalizeForMatch(message)
  const lastTurns = history
    .slice(-4)
    .map((item) => normalizeForMatch(item.parts?.[0]?.text || ''))
    .join(' ')
  const combined = `${lastTurns} ${text}`

  if (/(hola|buenas|hey|que tal|que pasa)/.test(text)) {
    return pickRandom([
      'Bienvenido, madridista. Estoy en modo gratis local y listo para hablar de futbol. Hala Madrid.',
      'Aqui estamos, en clave blanca. Preguntame por tactica, historia o jugadores. Hala Madrid.',
    ])
  }

  if (/(alineacion|once|titular|esquema|4-3-3|4-4-2)/.test(combined)) {
    return 'Como base competitiva, el Madrid suele crecer con bloque medio-alto, laterales profundos y centro del campo con llegada. Si quieres, te propongo un once para el proximo partido. Hala Madrid.'
  }

  if (/(champions|europa|orejona|decima|decimoquinta|15)/.test(combined)) {
    return 'En Champions, la identidad del Madrid mezcla gestion emocional, experiencia y pegada en momentos clave. La historia pesa porque el equipo sabe competir cuando mas quema. Hala Madrid.'
  }

  if (/(barca|clasico|atletico|derbi|derby|rival)/.test(combined)) {
    return 'En partidos grandes, la clave blanca suele ser controlar transiciones y castigar espalda de laterales con ritmo. Si te va, te hago una previa rapida tipo clasico. Hala Madrid.'
  }

  if (/(vinicius|bellingham|mbappe|rodrygo|valverde|modric|courtois|camavinga|tchouameni)/.test(combined)) {
    return 'Ese jugador es diferencial por impacto en ritmo de partido y momentos de area. Si quieres, te saco fortalezas, riesgos y encaje tactico en 5 lineas. Hala Madrid.'
  }

  if (/(historia|leyenda|palmares|copas|titulos|bernabeu|santiago bernabeu)/.test(combined)) {
    return 'La historia del Real Madrid se sostiene en exigencia competitiva continua: generaciones distintas, mismo estandar. El Bernabeu es escenario, pero la mentalidad es la verdadera firma. Hala Madrid.'
  }

  if (/(fichaje|mercado|rumor|rumores|traspaso)/.test(combined)) {
    return 'En mercado, separa rumor de necesidad real: perfil, edad, coste y encaje en estructura. Si quieres, te analizo un posible fichaje con pros y contras. Hala Madrid.'
  }

  if (/(partido|calendario|proximo|proximo partido|fecha|hora)/.test(combined)) {
    return 'Para preparar un partido: rival, forma reciente, duelos clave y plan A/B. Si me dices el rival te doy una previa completa en formato corto. Hala Madrid.'
  }

  return pickRandom([
    'Modo gratis activado. Puedo ayudarte con tactica, historia, alineaciones y analisis madridista. Dime el tema y te respondo directo. Hala Madrid.',
    'Vamos al grano: dame un rival, un jugador o una idea tactica y te monto analisis rapido en clave madridista. Hala Madrid.',
  ])
}

function mapGeminiError(error) {
  const status = Number(error?.status || 500)
  const text = String(error?.message || '')
  const lower = text.toLowerCase()

  if (lower.includes('gemini_api_key')) {
    return {
      status: 500,
      message: 'Falta GEMINI_API_KEY en el servidor.',
    }
  }

  if (status === 429 || lower.includes('quota exceeded')) {
    return {
      status: 429,
      message: 'Gemini no tiene cuota disponible ahora mismo. Activa billing o espera al reinicio de cuota.',
    }
  }

  if (status === 403) {
    return {
      status: 403,
      message: 'La API key de Gemini no tiene permisos para generar contenido.',
    }
  }

  if (status === 404) {
    return {
      status: 500,
      message: 'No se encontro un modelo Gemini compatible. Revisa GEMINI_MODEL.',
    }
  }

  return {
    status: 500,
    message: 'No se pudo generar la respuesta del asistente madridista.',
  }
}

function mapDeepSeekError(error) {
  const status = Number(error?.status || 500)
  const text = String(error?.message || '')
  const lower = text.toLowerCase()

  if (lower.includes('deepseek_api_key')) {
    return {
      status: 500,
      message: 'Falta DEEPSEEK_API_KEY en el servidor.',
    }
  }

  if (status === 429 || lower.includes('quota')) {
    return {
      status: 429,
      message: 'DeepSeek no tiene cuota disponible ahora mismo.',
    }
  }

  if (status === 401 || status === 403) {
    return {
      status: 403,
      message: 'La API key de DeepSeek no es valida o no tiene permisos.',
    }
  }

  if (status === 402 || lower.includes('insufficient balance')) {
    return {
      status: 402,
      message: 'DeepSeek responde saldo insuficiente (Insufficient Balance). Recarga tu cuenta de DeepSeek.',
    }
  }

  return {
    status: 500,
    message: 'No se pudo generar la respuesta con DeepSeek.',
  }
}

function mapGroqError(error) {
  const status = Number(error?.status || 500)
  const text = String(error?.message || '')
  const lower = text.toLowerCase()

  if (lower.includes('groq_api_key')) {
    return {
      status: 500,
      message: 'Falta GROQ_API_KEY en el servidor.',
    }
  }

  if (status === 429 || lower.includes('quota') || lower.includes('rate limit')) {
    return {
      status: 429,
      message: 'Groq no tiene cuota disponible ahora mismo o superaste el limite de peticiones.',
    }
  }

  if (status === 401 || status === 403) {
    return {
      status: 403,
      message: 'La API key de Groq no es valida o no tiene permisos.',
    }
  }

  if (status === 402 || lower.includes('insufficient')) {
    return {
      status: 402,
      message: 'Groq responde credito insuficiente. Revisa saldo o plan.',
    }
  }

  return {
    status: 500,
    message: 'No se pudo generar la respuesta con Groq.',
  }
}

app.use(
  cors({
    origin: true,
  }),
)
app.use(express.json({ limit: '1mb' }))

app.get('/health', (_, res) => {
  res.json({ ok: true, service: 'madridista-chatbot', provider: resolveProvider() })
})

async function handleChatbotRequest(req, res) {
  const provider = resolveProvider()

  try {
    const message = cleanText(req.body?.message)
    const history = normalizeHistory(req.body?.history)

    if (!message) {
      return res.status(400).json({ error: 'El mensaje no puede ir vacio.' })
    }

    const reply =
      provider === 'local'
        ? askLocalMadridista({ message, history })
        : provider === 'deepseek'
          ? await askDeepSeek({ message, history })
          : provider === 'groq'
            ? await askGroq({ message, history })
            : await askGemini({ message, history })
    return res.json({ reply })
  } catch (error) {
    console.error('Chatbot error:', error)
    const mapped =
      provider === 'deepseek'
        ? mapDeepSeekError(error)
        : provider === 'groq'
          ? mapGroqError(error)
          : provider === 'gemini'
            ? mapGeminiError(error)
            : { status: 500, message: 'No se pudo generar la respuesta del asistente local.' }
    return res.status(mapped.status).json({ error: mapped.message })
  }
}

app.post('/api/chatbot', handleChatbotRequest)
// Compatibilidad con implementaciones anteriores
app.post('/chat', handleChatbotRequest)

app.use('/api', (_, res) => {
  return res.status(404).json({ error: 'Endpoint de API no encontrado.' })
})

app.use((error, _, res) => {
  if (error instanceof SyntaxError && 'body' in error) {
    return res.status(400).json({ error: 'JSON invalido en la solicitud.' })
  }

  console.error('Unhandled server error:', error)
  return res.status(500).json({ error: 'Error interno del servidor.' })
})

app.listen(port, () => {
  console.log(`Servidor del chatbot escuchando en http://localhost:${port}`)
})
