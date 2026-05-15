export function encodeLineup(lineup) {
  const { id, teamName, league, players } = lineup
  return btoa(JSON.stringify({ sourceId: id, teamName, league, players }))
}

export function decodeLineup(str) {
  const { sourceId, teamName, league, players } = JSON.parse(atob(str))
  if (!Array.isArray(players) || players.length === 0) throw new Error('invalid')
  return { sourceId: sourceId ?? null, teamName: teamName ?? '', league: league ?? '', players }
}

export function buildShareUrl(lineup) {
  return `${window.location.origin}${window.location.pathname}#import=${encodeLineup(lineup)}`
}
