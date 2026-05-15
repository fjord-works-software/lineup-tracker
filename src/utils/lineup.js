export function onDeckIndex(currentIndex, length) {
  return (currentIndex + 1) % length
}

export function inHoleIndex(currentIndex, length) {
  return (currentIndex + 2) % length
}
