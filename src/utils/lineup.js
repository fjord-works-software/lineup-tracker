function enabledIndices(players) {
  return players.reduce((acc, p, i) => {
    if (p.enabled !== false) acc.push(i)
    return acc
  }, [])
}

function step(players, currentIndex, direction) {
  const enabled = enabledIndices(players)
  if (enabled.length === 0) return currentIndex
  const pos = enabled.indexOf(currentIndex)
  const next = (pos === -1 ? 0 : pos + direction + enabled.length) % enabled.length
  return enabled[next]
}

export function nextIndex(players, currentIndex) {
  return step(players, currentIndex, 1)
}

export function prevIndex(players, currentIndex) {
  return step(players, currentIndex, -1)
}

export function onDeckIndex(players, currentIndex) {
  return step(players, currentIndex, 1)
}

export function inHoleIndex(players, currentIndex) {
  return step(players, onDeckIndex(players, currentIndex), 1)
}

export function firstEnabledIndex(players) {
  const i = players.findIndex(p => p.enabled !== false)
  return i === -1 ? 0 : i
}
