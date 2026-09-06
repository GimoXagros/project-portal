export async function sha256Hex(data) {
  if (!globalThis.crypto?.subtle) throw new Error('이 브라우저는 SHA-256 검증을 지원하지 않습니다.')
  const buffer = data instanceof ArrayBuffer ? data : data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)
  const digest = await globalThis.crypto.subtle.digest('SHA-256', buffer)
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

export function formatByteSize(bytes) {
  if (!Number.isSafeInteger(bytes) || bytes < 0) return '알 수 없음'
  return `${new Intl.NumberFormat('ko-KR').format(bytes)} bytes`
}
