import { useEffect, useMemo, useState } from 'react'
import { getTeamBadgeFallback, resolveTeamBadge } from '../services/teamBadgeService'

export function useTeamBadges(teamNames) {
  const [badgeMap, setBadgeMap] = useState({})

  const normalizedNames = useMemo(
    () => Array.from(new Set((teamNames || []).map((name) => name?.trim()).filter(Boolean))),
    [teamNames],
  )

  useEffect(() => {
    let cancelled = false
    const mobileViewport = typeof window !== 'undefined' && window.innerWidth <= 900

    async function loadBadges() {
      if (!normalizedNames.length) {
        setBadgeMap({})
        return
      }

      if (mobileViewport) {
        const fallbackEntries = normalizedNames.map((name) => [name, getTeamBadgeFallback(name)])
        setBadgeMap(Object.fromEntries(fallbackEntries))
        return
      }

      const entries = await Promise.all(
        normalizedNames.map(async (name) => {
          const remote = await resolveTeamBadge(name)
          return [name, remote || getTeamBadgeFallback(name)]
        }),
      )

      if (!cancelled) {
        setBadgeMap(Object.fromEntries(entries))
      }
    }

    loadBadges()

    return () => {
      cancelled = true
    }
  }, [normalizedNames])

  return badgeMap
}
