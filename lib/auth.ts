export type Role = 'admin' | 'viewer' | 'limited'

export interface Session {
  userId: number
  username: string
  role: Role
  exp: number
}

export const SESSION_COOKIE = 'mz_session'
export const SESSION_MAX_AGE = 30 * 24 * 60 * 60 // 30 days in seconds

function getSecret(): string {
  const s = process.env.SESSION_SECRET
  if (!s) throw new Error('SESSION_SECRET is not set')
  return s
}

function bufToBase64url(buf: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < buf.byteLength; i++) binary += String.fromCharCode(buf[i])
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function base64urlToBuf(str: string): Uint8Array {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/') + '=='.slice(0, (4 - str.length % 4) % 4)
  const binary = atob(padded)
  const buf = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) buf[i] = binary.charCodeAt(i)
  return buf
}

async function getKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}

export async function signSession(data: Session): Promise<string> {
  const payload = bufToBase64url(new TextEncoder().encode(JSON.stringify(data)))
  const key = await getKey()
  const sigBuf = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))
  return `${payload}.${bufToBase64url(new Uint8Array(sigBuf))}`
}

export async function verifySession(token: string): Promise<Session | null> {
  try {
    const dot = token.lastIndexOf('.')
    if (dot === -1) return null
    const payload = token.slice(0, dot)
    const sig = token.slice(dot + 1)
    const key = await getKey()
    const valid = await crypto.subtle.verify(
      'HMAC', key,
      base64urlToBuf(sig),
      new TextEncoder().encode(payload)
    )
    if (!valid) return null
    const data = JSON.parse(new TextDecoder().decode(base64urlToBuf(payload))) as Session
    if (data.exp < Date.now()) return null
    return data
  } catch {
    return null
  }
}

export async function getSessionFromCookies(): Promise<Session | null> {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return null
  return verifySession(token)
}
