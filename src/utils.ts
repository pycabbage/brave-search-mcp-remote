export function stringify(data: unknown, pretty = false) {
  return pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data)
}
