import { useEffect, useState } from 'react'

const RSS_SOURCE = 'https://e00-marca.uecdn.es/rss/futbol/real-madrid.xml'
const RSS_PROXY_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_SOURCE)}`

async function safeJson(response) {
  const text = await response.text()
  if (!text) return null

  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

function cleanHtml(value) {
  if (!value) return ''

  const parser = new DOMParser()
  const doc = parser.parseFromString(value, 'text/html')
  const text = doc.body.textContent ?? ''
  return text.replace(/\s+/g, ' ').trim()
}

function normalizeItem(item) {
  return {
    id: item.guid || item.link,
    title: cleanHtml(item.title),
    link: item.link,
    date: item.pubDate,
    description: cleanHtml(item.description || item.content || ''),
  }
}

export function useRssFeed(limit = 6) {
  const [articles, setArticles] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [lastUpdate, setLastUpdate] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadFeed() {
      setStatus('loading')
      setError('')

      try {
        const response = await fetch(RSS_PROXY_URL, { signal: controller.signal })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const payload = await safeJson(response)

        if (!payload || payload.status !== 'ok' || !Array.isArray(payload.items)) {
          throw new Error('Formato de respuesta RSS invalido')
        }

        const parsedArticles = payload.items
          .slice(0, limit)
          .map(normalizeItem)
          .filter((article) => article.id && article.link && article.title)

        if (!parsedArticles.length) {
          throw new Error('El feed no devolvio noticias')
        }

        setArticles(parsedArticles)
        setStatus('success')
        setLastUpdate(new Date())
      } catch (rssError) {
        if (controller.signal.aborted) return

        setStatus('error')
        setError('No fue posible cargar la actualidad en este momento.')
        setArticles([])
        console.error('RSS load error:', rssError)
      }
    }

    loadFeed()

    return () => {
      controller.abort()
    }
  }, [limit, reloadKey])

  function refresh() {
    setReloadKey((value) => value + 1)
  }

  return {
    articles,
    status,
    error,
    refresh,
    lastUpdate,
    sourceName: 'Marca - Real Madrid',
    sourceUrl: RSS_SOURCE,
  }
}
