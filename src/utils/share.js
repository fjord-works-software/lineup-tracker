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

function jsonToBase64(obj) {
  const json = JSON.stringify(obj)
  const bytes = new TextEncoder().encode(json)
  let binary = ''
  for (const b of bytes) binary += String.fromCharCode(b)
  return btoa(binary)
}

function base64ToJson(str) {
  const binary = atob(str)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return JSON.parse(new TextDecoder().decode(bytes))
}

export function encodeLineup(lineup) {
  const { id, teamName, league, players } = lineup
  return jsonToBase64({ sourceId: id, teamName, league, players })
}

export function decodeLineup(str) {
  const { sourceId, teamName, league, players } = base64ToJson(str)
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
