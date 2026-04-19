const API_BASE = 'https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t='
const CACHE_PREFIX = 'team_badge_cache_v1:'
const memoryCache = new Map()
const TEAM_ALIASES = {
  bayern: 'Bayern Munich',
  barca: 'FC Barcelona',
  barcelona: 'FC Barcelona',
  betis: 'Real Betis',
  fenerbahce: 'Fenerbahce',
  monaco: 'AS Monaco',
  unicaja: 'Unicaja',
}

function normalizeTeamName(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
}

function getLocalCached(teamName) {
  try {
    const value = localStorage.getItem(`${CACHE_PREFIX}${normalizeTeamName(teamName)}`)
    return value || ''
  } catch {
    return ''
  }
}

function setLocalCached(teamName, badgeUrl) {
  try {
    localStorage.setItem(`${CACHE_PREFIX}${normalizeTeamName(teamName)}`, badgeUrl || '')
  } catch {
    // ignore storage issues
  }
}

async function searchTeamBadge(teamName) {
  const response = await fetch(`${API_BASE}${encodeURIComponent(teamName)}`)
  if (!response.ok) return ''

  const text = await response.text()
  if (!text) return ''

  let data = null
  try {
    data = JSON.parse(text)
  } catch {
    return ''
  }

  if (!Array.isArray(data?.teams) || !data.teams.length) return ''

  const requested = normalizeTeamName(teamName)
  const exact = data.teams.find(
    (team) => normalizeTeamName(team?.strTeam) === requested,
  )
  const close = data.teams.find((team) => normalizeTeamName(team?.strTeam).includes(requested))

  return (exact || close || data.teams[0])?.strBadge || ''
}

async function requestTeamBadge(teamName) {
  let direct = ''
  try {
    direct = await searchTeamBadge(teamName)
  } catch {
    direct = ''
  }
  if (direct) return direct

  const alias = TEAM_ALIASES[normalizeTeamName(teamName)]
  if (!alias) return ''

  try {
    return await searchTeamBadge(alias)
  } catch {
    return ''
  }
}

export async function resolveTeamBadge(teamName) {
  if (!teamName) return ''
  const key = normalizeTeamName(teamName)

  if (memoryCache.has(key)) {
    return memoryCache.get(key)
  }

  const localCached = getLocalCached(teamName)
  if (localCached) {
    memoryCache.set(key, localCached)
    return localCached
  }

  const badgeUrl = await requestTeamBadge(teamName)
  memoryCache.set(key, badgeUrl)
  setLocalCached(teamName, badgeUrl)
  return badgeUrl
}

export function getTeamBadgeFallback(teamName) {
  if (!teamName) return '/media/teams/real-madrid.png'
  if (teamName.toLowerCase().includes('real madrid')) return '/media/teams/real-madrid.png'
  return '/media/teams/girona.svg'
}
