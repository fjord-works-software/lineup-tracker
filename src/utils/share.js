export function encodeLineup(lineup) {
  const { teamName, league, players } = lineup
  return btoa(JSON.stringify({ teamName, league, players }))
}

export function decodeLineup(str) {
  const { teamName, league, players } = JSON.parse(atob(str))
  if (!Array.isArray(players) || players.length === 0) throw new Error('invalid')
  return { teamName: teamName ?? '', league: league ?? '', players }
}

export function buildShareUrl(lineup) {
  return `${window.location.origin}${window.location.pathname}#import=${encodeLineup(lineup)}`
}
