const MAX_STRING_LENGTH = 100
const MAX_PLAYERS = 25

function validateString(val, fallback = '') {
  if (val === null || val === undefined) return fallback
  if (typeof val !== 'string') throw new Error('invalid')
  if (val.length > MAX_STRING_LENGTH) throw new Error('invalid')
  return val
}

// IDs are generated as Math.random().toString(36).slice(2, 9) — 7 lowercase base-36 chars.
const ID_RE = /^[0-9a-z]{7}$/

function validateSourceId(val) {
  if (typeof val !== 'string' || !ID_RE.test(val)) throw new Error('invalid')
  return val
}

function validatePlayer(p) {
  if (!p || typeof p !== 'object' || Array.isArray(p)) throw new Error('invalid')
  return {
    name: validateString(p.name),
    number: validateString(p.number),
    position: validateString(p.position),
    enabled: p.enabled === false ? false : true,
  }
}

function validatePlayers(players) {
  if (!Array.isArray(players) || players.length === 0 || players.length > MAX_PLAYERS) {
    throw new Error('invalid')
  }
  return players.map(validatePlayer)
}

export function encodeLineup(lineup) {
  const { id, teamName, league, players } = lineup
  return btoa(JSON.stringify({ sourceId: id, teamName, league, players }))
}

export function decodeLineup(str) {
  const { sourceId, teamName, league, players } = JSON.parse(atob(str))
  return {
    sourceId: sourceId != null ? validateSourceId(sourceId) : null,
    teamName: validateString(teamName),
    league: validateString(league),
    players: validatePlayers(players),
  }
}

export function buildShareUrl(lineup) {
  return `${window.location.origin}${window.location.pathname}#import=${encodeLineup(lineup)}`
}

export function encodeBackup(lineups) {
  return btoa(JSON.stringify({ v: 1, lineups }))
}

export function decodeBackup(code) {
  const parsed = JSON.parse(atob(code.trim()))
  if (parsed.v !== 1 || !parsed.lineups || typeof parsed.lineups !== 'object' || Array.isArray(parsed.lineups)) {
    throw new Error('Invalid backup code')
  }
  const validated = {}
  for (const [key, lineup] of Object.entries(parsed.lineups)) {
    if (!lineup || typeof lineup !== 'object') throw new Error('Invalid backup code')
    validated[key] = {
      id: validateString(lineup.id),
      teamName: validateString(lineup.teamName),
      league: validateString(lineup.league),
      players: validatePlayers(lineup.players),
    }
  }
  return validated
}
